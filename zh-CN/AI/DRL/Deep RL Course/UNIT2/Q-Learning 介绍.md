# Q-Learning 介绍

## 什么是 Q-Learning？

Q-Learning 是一种异策略（off-policy）value-based 的方法，它使用时序差分方法（TD approach）来训练 action-value 函数：
- off-policy：本单元的最后我们再讨论这个概念
- value-based method：通过训练一个 value / action-value function 来间接找到最优 policy，value function 告诉我们每个 state 的 value，action-value function 告诉我们每对 state-action的value
- TD approach：在每一步更新 action-value function

Q-Learning 是我们用来训练 Q-function 的算法，前面我们知道 Q-function 就是 action-value function，它给出了某状态下采取某动作的价值

![[pic-20250315120019240.png]]
Q-function 输出的 state-action value 也称 Q-value

Q-function 中的“Q”来源于“Quality”，指某个 action 在某个 state 下的“Quality”（value）

让我们回顾一下 value 和 reward 之间的区别：

- 状态的价值或状态-动作对的价值是智能体在此状态（或状态-动作对）按照其策略行动时的期望累积奖励
- 奖励是某状态下执行动作后从环境中获得的反馈

在 Q-function 的内部有一个 Q-table 进行编码，Q-table 是一个表格，其每个单元格对应一个 state-action pair value。可以把这个 Q-table 想象成 Q-function 的记忆或备忘录

下面通过一个迷宫的例子来解释：

![[pic-20250315125101278.png]]

先将 Q-table 中的每一个值初始化为 0，Q-table 的每一行代表一个 state，每一列代表一个 action，每个格子代表<对应行的 state-对应列的action> 的 value，所以表格的一行就表示某个状态下不同动作的 value

对于图中的简例，state 就是老鼠的位置，共有 6 个位置，就有 6 个 state，对应 Q-table 就有 6 行，当然真实情况下 state 包含的信息多得多：

![[pic-20250315130247381.png]]

可以看到，初始状态下采取向上的动作价值为 0（初始态-向上）

![[pic-20250315143707912.png]]

因此，给定一个 action 和 state，Q-function 会在 Q-table 中搜索并输出value（Q-value）

总结下 Q-Learning 算法：

- 训练一个 Q-function（一个 action-value 函数），其内部是一个包含所有 state-action pair 的 Q-table
- 当给定一个 state 和 action，Q-function 会从 Q-table 中搜索找到对应的 Q-value
- 训练完成后，我们得到一个最优 Q-function，这也意味着我们得到一个最优 Q-table
- 如果我们得到了最优 Q-function，我们就知道在每种 state 下应该选取什么 action，也就得到了最优 policy

![[pic-20250315150236402.png]]

一开始 Q-table 被初始化为任意值（大多数情况下，我们将其初始化为 0），这时 Q-table 没有什么用，但随着 Agent 探索环境不断更新 Q-table，它会给我们越来越接近最优策略的近似值

![[pic-20250315150753943.png]]

现在我们已经了解了什么是 Q-Learning、Q-functions、Q-tables，下面让我们深入学习 Q-Learning 算法：

## Q-Learning 算法

下图是 Q-Learning 算法的伪代码：

![[pic-20250315152851572.png]]

### 第一步：初始化 Q-table

![[pic-20250315155241783.png]]

初始化 Q-table 中的每个 state-action pair，大多数情况下，我们初始化为 0

### 第二步：使用 epsilon-greedy 策略选择一个 action

![[pic-20250315155439104.png]]

epsilon-greedy 策略是一种平衡 exploration/exploitation 的策略

先给 epsilon 赋一个值，例如：$\epsilon=1.0$：
- 智能体将以 $\epsilon$ 的概率进行探索（exploration），此时智能体将随机选择 action
- 智能体将以 $1-\epsilon$ 的概率进行利用（exploitation），此时智能体将选择有最大 state-action pair 值的 action