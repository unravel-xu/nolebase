# Q-Learning 回顾

Q-Learning 是一种强化学习算法：
- 训练一个Q函数：一种 action-value 函数，其内部有一个 Q-table，用于存储所有 state-action pair 的价值
- 当给定一个状态和动作时，Q-function 会在 Q-table 中查找相应的值

![[pic-20250315231532722.png]]

- 训练完成后，我们会得到一个最优 Q-function 或者等价地说，得到了一个最优 Q-table
- 当我们有一个最优 Q-function，我们就得到了最优策略，因为知道了在每个状态下最佳动作是什么

![[pic-20250315231857702.png]]

在训练最开始，Q-table 没什么用，因为它为每个状态-动作对提供了任意的值（通常我们会将 Q-table 初始化为全 0）。但随着我们不断地探索环境并更新 Q-table，它将为我们提供越来越好的近似