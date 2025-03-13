# 训练 Huggy

同样我们使用 Google Colab 进行实验：<a href="https://colab.research.google.com/github/huggingface/deep-rl-class/blob/master/notebooks/bonus-unit1/bonus-unit1.ipynb" rel="nofollow"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open In Colab"></a>

## 训练相关

最终要实现的效果如下：

<video controls autoplay><source src="https://huggingface.co/datasets/huggingface-deep-rl-course/course-images/resolve/main/en/notebooks/unit-bonus1/huggy.mp4" type="video/mp4"></video>

训练环境：Huggy the Dog

相关库：[MLAgents](https://github.com/Unity-Technologies/ml-agents)

一些准备工作不再赘述

## 配置虚拟环境

首先 clone ML-Agents 的仓库

```bash
# Clone the repository (can take 3min)
git clone --depth 1 https://github.com/Unity-Technologies/ml-agents
```

检查 ML-Agents 需要的 python 版本：在文件 setup.py 中查看参数 python_requires，路径为：
- /content/ml-agents/ml-agents/setup.py
- /content/ml-agents/ml-agents-envs/setup.py

![[pic-20250313104255073.png]]

![[pic-20250313104408521.png]]

查看当前 Colab 的 Python 版本：`!python --version`，如果 python 版本不匹配，执行代码可能会出现如下报错：
- /bin/bash: line 1: mlagents-learn: command not found
- /bin/bash: line 1: mlagents-push-to-hf: command not found

我们创建一个虚拟环境解决这个问题：

```bash
# 安装并创建虚拟环境
!pip install virtualenv
!virtualenv myenv

# 安装Miniconda
!wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
!chmod +x Miniconda3-latest-Linux-x86_64.sh
!./Miniconda3-latest-Linux-x86_64.sh -b -f -p /usr/local

# 激活Miniconda并安装Python 3.10.12
!source /usr/local/bin/activate
!conda install -q -y --prefix /usr/local python=3.10.12 ujson

# 配置环境变量
!export PYTHONPATH=/usr/local/lib/python3.10/site-packages/
!export CONDA_PREFIX=/usr/local/envs/myenv
```

## 安装依赖

```shell
%%capture
# Go inside the repository and install the package (can take 3min)
%cd ml-agents
!pip3 install -e ./ml-agents-envs
!pip3 install -e ./ml-agents
```

## 下载环境

先创建放置环境的文件夹

```shell
!mkdir ./trained-envs-executables #总文件夹
!mkdir ./trained-envs-executables/linux # 执行环境文件夹
```

从 github 下载环境，我们只需要 zip 文件就行

```shell
!wget "https://github.com/huggingface/Huggy/raw/main/Huggy.zip" -O ./trained-envs-executables/linux/Huggy.zip
```

解压环境

```shell
%%capture
!unzip -d ./trained-envs-executables/linux/ ./trained-envs-executables/linux/Huggy.zip
```

修改文件夹权限

```shell
!chmod -R 755 ./trained-envs-executables/linux/Huggy
```

## 回顾整个流程

### State Space

和前面提到的一样，我们不区分状态空间和观测空间，认为状态空间就是 Huggy 能“感知”到的内容。我们为 Huggy 提供一些信息：目标（木棍）的位置，它和目标的相对位置，它的腿部朝向。通过提供的信息，Huggy 做出决策采取哪个动作

### Action Space

Huggy 的腿由关节电机驱动，所以为朝目标移动，它需要学习如何正确旋转每条腿的关节电机

### Reward Function

包括四种奖励：方向奖励、时间惩罚、旋转惩罚、到达目标奖励

## 创建 Huggy 配置文件

在 ML-Agent 中，创建 config.yaml 配置文件来定义训练的超参数，示例全部使用默认，如果想自己调整超参数实验，可以参考[说明文档](https://github.com/Unity-Technologies/ml-agents/blob/main/docs/Training-Configuration-File.md)

我们还需要创建一个 Huggy.yaml 配置文件：

```bash
touch ./content/ml-agents/config/ppo/huggy.yaml
```

复制粘贴如下配置：

```yaml
behaviors:
  Huggy:
    trainer_type: ppo
    hyperparameters:
      batch_size: 2048
      buffer_size: 20480
      learning_rate: 0.0003
      beta: 0.005
      epsilon: 0.2
      lambd: 0.95
      num_epoch: 3
      learning_rate_schedule: linear
    network_settings:
      normalize: true
      hidden_units: 512
      num_layers: 3
      vis_encode_type: simple
    reward_signals:
      extrinsic:
        gamma: 0.995
        strength: 1.0
    # 每200000步保存一次
    checkpoint_interval: 200000
    keep_checkpoints: 15
    max_steps: 2e6
    time_horizon: 1000
    summary_freq: 50000
```

