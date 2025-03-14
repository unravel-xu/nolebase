# Monte Carlo vs Temporal Difference Learning

在深入学习 Q-learning 算法之前，我们需要先了解一下两种学习策略

Monte Carlo（蒙特卡洛）和 Temporal Difference Learning（时序差分学习）在训练 value function 或 policy function 时是两种不同的方式，但它们都使用经验来解决强化学习问题

Monte Carlo 使用整个 episode 的经验来学习，而 Temporal Difference Learning 只使用一个步骤 $(S_t, A_t, R_{t+1}, S_{t+1})$ 来进行学习

我们使用一个 value-based 的示例来解释它们

## Monte Carlo：在一个 episode 结束后进行学习

Monte Carlo 等到整个 episode 结束后才计算 $G_{t}$（回报）并将 $G_{t}$ 作为更新 $V(S_{t})$ 的目标

因此，在更新 value function 前，它需要一个完整的交互过程

![[pic-20250314230026171.png]]

例如：

![[pic-20250314230346885.png]]

- 我们始终从相同的起点开始新的回合（episode）
- Agent 根据 policy 选择 action，如使用 $\epsilon -Greddy$ 策略
- 得到 reward 和下一个 state
- 如果猫吃掉老鼠或老鼠移动超过 10 步，回合结束
- 回合结束后，我们会得到一个 State、Actions、Rewards、Next States