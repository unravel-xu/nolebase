# Q-Learning 介绍

## 什么是 Q-Learning？

Q-Learning 是一种异策略（off-policy）value-based 的方法，它使用时序差分方法（TD approach）来训练 action-value 函数：
- off-policy：本单元的最后我们再讨论这个概念
- value-based method：通过训练一个 value / action-value function 来间接找到最优 policy，value function 告诉我们每个 state 的 value，action-value function 告诉我们每对 state-action的value
- TD approach：在每一步更新 action-value function

Q-Learning 是我们用来训练 Q-function 的算法，前面我们知道 Q-function 就是 action-value function，它给出了某状态下采取某动作的价值

![[pic-20250315120019240.png]]
Q-function 输出的 state-action value 也称 Q-value

Q-function 中的“Q”来源于“Quality”，指代某个 action 在某个 state 下
