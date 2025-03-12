# 训练第一个 DRL Agent

![[lunarLander.gif]]

在本小节中，将学会训练一个月球着陆器智能体，使其以正确的姿态着陆月球

如果想要获取证书，需要将训练好的模型上传到 Hugging Face Hub 且分数 $\geq$ 200

可以在 [leaderboard](https://huggingface.co/spaces/huggingface-projects/Deep-Reinforcement-Learning-Leaderboard) 找到结果

在 [Check-my-progress-Deep-RL-Course](https://huggingface.co/spaces/ThomasSimonini/Check-my-progress-Deep-RL-Course) 可以查看这门课的实验进度

下面通过 Colab 开始实验：<a href="https://colab.research.google.com/github/huggingface/deep-rl-class/blob/master/notebooks/unit1/unit1.ipynb" rel="nofollow"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open In Colab"></a>

在安装完一系列依赖后

## Gymnasium 库的使用

Gymnasium 库功能：
- 提供创建 RL 环境的接口
- 包含一系列的 RL 环境

![[pic-20250311165734466.png]]

回顾一个 RL 循环的步骤：

1. agent 从环境接收 state（$S_{0}$）
2. 基于接收的 state（$S_{0}$），agent 采取 action（$A_{0}$）
3. 环境变化，转移到新的 state（$S_{1}$）
4. 环境反馈 reward（$R_{1}$） 给 agent

用 [Gymnasium 库](https://gymnasium.farama.org/api/env/#gymnasium.Env.step)，对应的关键代码就是：

0. 创建环境：`gymnasium.make()`
1. 初始化环境（$S_{0}$）：`observation = env.reset()`
2. agent 采取 `action = env.action_space.sample()`（给的例子中 action 是随机选取）
3. `env.step(action)`
4. 接收上一步的返回值 `observation, reward, terminated, truncated, info = env.step(action)`
	- observation：new state
	- terminated：判断游戏是否结束
	- truncated：判断游戏是否超时或 agent 是否超出环境边界
	- info：以字典格式给出一些额外信息

运行给的代码报错，解决方法：

修改：`env = gym.make("LunarLander-v3")`

添加依赖：

```bash
!pip install swig
!pip install gymnasium[box2d]
```

顺利运行得到结果

## 创建 LunarLander 环境

[Lunar Lander 环境说明](https://gymnasium.farama.org/environments/box2d/lunar_lander/)

我们需要学习调整着陆器的速度和其位置（包括水平坐标，垂直坐标，角度）

```python
# We create our environment with gym.make("<name_of_the_environment>")
env = gym.make("LunarLander-v3")
env.reset()
print("_____OBSERVATION SPACE_____ \n")
print("Observation Space Shape", env.observation_space.shape)
print("Sample observation", env.observation_space.sample()) # Get a random observation
```

环境格式是有 8 个元素的一维向量：

```bash
_____OBSERVATION SPACE_____ 

Observation Space Shape (8,)
Sample observation [-0.198397  -0.2969256  -1.9465257  3.6811924  3.5031452  2.0033157  0.23429972  0.580053]
```

向量的 8 个分量分别表示：
- 水平垫坐标 (x)
- 垂直垫坐标 (y)
- 水平速度 (x)
- 垂直速度 (y)
- 角度
- 角速度
- 左腿接触点是否接触地面 (布尔值)
- 右腿接触点是否接触地面 (布尔值)

```python
print("\n _____ACTION SPACE_____ \n")
print("Action Space Shape", env.action_space.n)
print("Action Space Sample", env.action_space.sample()) # Take a random action
```

动作空间输出为：

```bash
 _____ACTION SPACE_____ 

Action Space Shape 4
Action Space Sample 0
```

动作空间（智能体可以采取的动作集合）是离散的，有 4 个可用的动作：
- 动作 0：什么都不做
- 动作 1：发动左侧定向引擎
- 动作 2：发动主引擎
- 动作 3：发动右侧定向引擎

游戏的每一步都有 reward，一个回合的总奖励是该回合内所有步骤奖励的总和。具体 reward 按如下方式给出：
- 越靠近/越远离着陆点，着陆器的奖励就越多/越少
- 着陆器移动得越慢/越快，奖励就越多/越少
- 着陆器倾斜得越多（角度非水平），奖励就越少
- 每有一个与地面接触的腿增加10分
- 每当侧向引擎发动时，奖励减少0.03分
- 每当主引擎发动时，奖励减少0.3分
- 如果坠毁或安全着陆，情节将获得额外的-100或+100分
- 如果回合得分 $\geq$ 200分，则认为是一个解决方案

## 向量化环境

向量化环境 Vectorized environments：是将同一环境的多个独立副本组织在一起运行，它接收一批 action 输入，同时返回一批 observation

我们创建包含 16 个副本的环境向量，在一论训练就可以获得 16 个 episode：

```python
# Create the environment
env = make_vec_env('LunarLander-v2', n_envs=16)
```

## 创建模型

我们使用 [Stable Baseline3](https://stable-baselines3.readthedocs.io/en/master/) 深度学习库，这个库包含了一系列用 PyTorch 实现的 RL 算法

采用 Stable Baseline3 库中的 [PPO](https://stable-baselines3.readthedocs.io/en/master/modules/ppo.html#example%5D) 算法解决这个问题

PPO 算法是 Value-based 和 Policy-based 的结合，简单来说：
- Value-based 方面：学习一个 action-value 函数，而不是 state-value 函数。action-value 函数会告诉我们在给定 <state，action> 下最有价值的 action 
- Policy-based 方面：学习一个 policy，告诉我们关于各个 action 的概率分布

```python
# Create environment
env = gym.make('LunarLander-v2')

# Instantiate the agent
# 定义想要使用的模型并实例化该模型
model = PPO('MlpPolicy', env, verbose=1)
# Train the agent
model.learn(total_timesteps=int(2e5))
```

下面我们考虑该用什么样的模型，每次模型的输入是 agent 的 observation，在上面我们提到 observation 是含 8 个元素的一维向量；模型的输出是 action，上述可知，是含 4 个元素的一维向量。于是不妨用最简单的 MLP 结构，当然如果输入是图像，输出是向量，就该用 CNN 结构

```python
# 我们添加了一些超参数来加快训练
model = PPO(
    policy = 'MlpPolicy',
    env = env,
    n_steps = 1024,
    batch_size = 64,
    n_epochs = 4,
    gamma = 0.999, # 折扣因子
    gae_lambda = 0.98,
    ent_coef = 0.01,
    verbose=1)
```

## 训练 PPO agent

我们训练 1 000 000 步，大概需要 20 分钟

```python
# Train it for 1,000,000 timesteps
model.learn(total_timesteps=1000000)
# Save the model
model_name = "ppo-LunarLander-v2"
model.save(model_name)
```

## 评估 agent

首先将环境打包到 [Monitor](https://stable-baselines3.readthedocs.io/en/master/common/monitor.html) 里监测

我们使用 Stable Baselines3 库提供的 `evaluate_policy` 函数来评估性能

> [!important]
> 在评估 agent 时，不应该使用训练环境，而应该创建专门的评估环境 

关于 [evaluate_policy](https://stable-baselines3.readthedocs.io/en/master/common/evaluation.html#eval) 函数的详细说明

```python
# 评估agent
eval_env = Monitor(gym.make("LunarLander-v2", render_mode='rgb_array'))
mean_reward, std_reward = evaluate_policy(model, eval_env, n_eval_episodes=10, deterministic=True)
print(f"mean_reward={mean_reward:.2f} +/- {std_reward}")
```

- n_eval_episodes = 10：表示运行 10 个回合来评估 agent
- deterministic = True：表示我们采用确定的 policy

## 发布训练好的模型到 Hugging Face Hub

首先创建一个有写权限的 Token

执行如下命令：
```bash
notebook_login()
!git config --global credential.helper store
```

最后只需执行 `package_to_hub()` 函数即可

```python
import gymnasium as gym

from stable_baselines3 import PPO
from stable_baselines3.common.vec_env import DummyVecEnv
from stable_baselines3.common.env_util import make_vec_env

from huggingface_sb3 import package_to_hub

# PLACE the variables you've just defined two cells above
# Define the name of the environment
env_id = "LunarLander-v2"

# TODO: Define the model architecture we used
model_architecture = "PPO"

## Define a repo_id
## repo_id is the id of the model repository from the Hugging Face Hub (repo_id = {organization}/{repo_name} for instance ThomasSimonini/ppo-LunarLander-v2
## CHANGE WITH YOUR REPO ID
repo_id = "EvaristeL/ppo-LunarLander-v2" # Change with your repo id, you can't push with mine 😄

## Define the commit message
commit_message = "Upload PPO LunarLander-v2 trained agent"

# Create the evaluation env and set the render_mode="rgb_array"
eval_env = DummyVecEnv([lambda: gym.make(env_id, render_mode="rgb_array")])

# PLACE the package_to_hub function you've just filled here
package_to_hub(model=model, # 训练好的模型
               model_name=model_name, # The name of our trained model
               model_architecture=model_architecture, # The model architecture we used: in our case PPO
               env_id=env_id, # Name of the environment
               eval_env=eval_env, # Evaluation Environment
               repo_id=repo_id, # id of the model repository from the Hugging Face Hub (repo_id = {organization}/{repo_name} for instance ThomasSimonini/ppo-LunarLander-v2
               commit_message=commit_message)
```

## 从 Hugging Face Hub 加载模型

首先到 [stable-baselines3库](https://huggingface.co/models?library=stable-baselines3)查看保存的模型

复制仓库id
![[pic-20250312161510663.png]]

我们还需要知道要加载的模型文件名

由于示例的模型使用 Gym（Gymnasium 的前身） 库训练的，所以使用 [Shimmy](https://github.com/Farama-Foundation/Shimmy) 库进行转换，以便正确运行环境

```bash
!pip install shimmy
```

```python
from huggingface_sb3 import load_from_hub
repo_id = "Classroom-workshop/assignment2-omar" # The repo_id
filename = "ppo-LunarLander-v2.zip" # The model filename.zip

# When the model was trained on Python 3.8 the pickle protocol is 5
# But Python 3.6, 3.7 use protocol 4
# In order to get compatibility we need to:
# 1. Install pickle5 (we done it at the beginning of the colab)
# 2. Create a custom empty object we pass as parameter to PPO.load()
custom_objects = {
            "learning_rate": 0.0,
            "lr_schedule": lambda _: 0.0,
            "clip_range": lambda _: 0.0,
}

checkpoint = load_from_hub(repo_id, filename)
model = PPO.load(checkpoint, custom_objects=custom_objects, print_system_info=True)
```

## 一些额外的挑战

可以自行调整下超参数，或者换一个模型例如 DQN 试试效果

此外还有很多不同游戏环境，可以查看 [Gymnasium Documentation](https://gymnasium.farama.org/)