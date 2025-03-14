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
- 回合结束后，我们会得到一个 $\left(State、Actions、Rewards、Next \ States \right)$ 构成的元组列表，如 

$$\begin{aligned}
& \left(状态: 第三个瓷砖的底部，向左移动，+1，状态: 第二个瓷砖的底部\right)\ ,\\
& \left(状态: 第二个瓷砖的底部，向左移动，+0，状态: 第一个瓷砖的底部\right)\ , \\
& \dots
\end{aligned}
$$
- Agent 将计算回报 $(G_t)$（以衡量其性能）
- 然后它会根据如下公式更新 $V(S_{t})$
![[pic-20250314232320433.png]]
- 更新后重新开始新一回合的游戏

通过训练越来越多的回合，智能体会把游戏玩的越来越好

假设 $Learning \ Rate \ \ \alpha = 0.1\ , \ \gamma=1$，policy 为采取随机 action

![[pic-20250314233035641.png]]

小老鼠随机移动超过了 10 步，回合结束：

$$
\begin{aligned}
G_{t=0} & = R_{t+1} + R_{t+2} + R_{t+3} + \dots \\
& = 1(吃到奶酪)+0+0+0+0+0+1(吃到奶酪)+1(吃到奶酪)+0+0 \\
& = 3
\end{aligned}
$$
$$

V(S_{0})_{new} = V(S_{0}) + \alpha \cdot \left[G_{0}-V(S_{0})\right]
$$

