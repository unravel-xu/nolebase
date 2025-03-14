# 两类value-based的方法

前一小节 What is RL？A short recap 略

UNIT1 曾简要介绍了 value-based 方法，我们知道会训练出一个 value function 将 state 映射到 state 的期望价值

![[pic-20250313222102511.png]]

一个状态的价值是 agent 从该状态开始，根据策略采取行动，最终可以获取的期望折扣回报

> [!question]
> 根据策略行动是什么意思？我们在 value-based 的方法中不会像 policy-based 的方法训练得到策略，而是得到 value function

但无论是 value-based 的方法还是 policy-based 的方法，我们的目标都是找到一个最优策略 $\pi^{*}$

要找到最优策略，对比这两种方法：

| ![[pic-20250313224958849.png]] | ![[pic-20250313230112377.png]] |
| ---------------------------------- | ------------------------------ |

- Policy-based：我们不用手动定义策略，策略通过训练得到
- Value-based：我们需要手动定义策略，例如当 value function 给出期望回报，我们希望 agent 采取能带来最大期望回报的动作，于是定义 policy 选择相应的动作，也就是采用贪心策略

因此，无论使用什么方法来解决问题，都会有一个 policy。只是在 policy-based 的方法中是通过训练得到的复杂 NN，而在 value-based 的方法中是一个简单的预定义函数

Value 和 Policy 的联系如下：

![[pic-20250313232356468.png]]

但在 value-based 的方法中，我们通常会使用 $\epsilon-$ 贪心策略而不是纯贪心策略以平衡 exploration/exploitation


