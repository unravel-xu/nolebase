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

下面介绍两种 value-based function：

## state-value function

![[pic-20250314101931854.png]]

从某个状态开始，之后每一步动作都按照策略 $\pi$ 选取，并返回期望回报

![[pic-20250314102438312.png]]

例如我们采取贪心策略并从 value = -7 的 state 开始，那么根据图中标注的 state value，会依次选择动作：向右、向右、向右、向下、向下、向右、向右

## action-value function

![[pic-20250314103118115.png]]

从某一个状态 $s$ 开始，选取任意一动作 $a$，得到 $<s(state)\ ,\ a(action)>$ 并转入新状态 $s'$，之后每一步动作都按照策略 $\pi$ 选取，返回期望回报

![[pic-20250314104831648.png]]

例如我们采取贪心策略并从 value = -7 的 state 开始，此时只有向右的 action，所以和 state-value 不会有区别，但当我们从 value = -6 的 state 开始：

![[pic-20250314105335026.png]]

会有两种 action 可以选择，state-value function 会如下计算：

$$V_{\pi}(s)=E_{\pi}\left(reward_{-6\to -5}+reward_{-5\to -4}+reward_{-4\to -3}\dots\right)$$

由于我们预先定义了贪心策略 $\pi$，那么 state = -6 不会转到 state = -7

但在 action-value function 中：

$$
Q_{\pi}(s,\ action1) = E_{\pi}\left(reward_{-6\to -5}+reward_{-5\to -4}+reward_{-4\to -3}\dots\right) 
$$

$$
Q_{\pi}(s,\ action2) = E_{\pi}\left(reward_{-6\to -7}+reward_{-7\to -8}\right) 
$$

从中我们发现区别在于：
- state-value 函数：只关注在这个 state 的价值
- action-value 函数：强调了这个 state 下采取每个可能 action 的价值

