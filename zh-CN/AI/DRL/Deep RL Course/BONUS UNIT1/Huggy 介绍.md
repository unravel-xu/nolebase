# Huggy 介绍

Huggy 是由 Hugging Face 制作的深度强化学习环境，基于 Unity MLAgents 团队的项目 Puppo the Corgi。此环境通过 Unity 游戏引擎和 MLAgents 创建。ML-Agents 是 Unity 游戏引擎的工具包，允许用户利用 Unity 创建环境或使用预制环境来训练智能体

![[pic-20250312230042040.png]]

在这个环境下，我们的目标是训练 Huggy 捡起扔的木棍，这要求 Huggy 能正确地朝着棍子移动

## Huggy 感知到状态空间

Huggy 无法“看到”它所处的环境，只能由我们向它提供有关环境的信息：
- 目标（木棍）位置
- Huggy 和目标之间的相对位置
- Huggy 腿的朝向

通过提供的信息，Huggy 可以根据 policy 决定下一步采取的 action

## 