# Deep Q-Learning 算法

我们知道 Deep Q-Learning 使用深度神经网络来近似每个状态下可能动作的不同 Q-value（value-function 估计）

和 Q-Learning 区别在于，训练阶段，我们不会直接更新 state-action pair 的 Q-value

![[pic-20250318090714506.png]]

Q-Learning 中，我们用 $TD \ Target - Q\left(S_{t},\ A_{t}\right)$ 衡量 Q-value 预测值和目标值之间的差距

Deep Q-Learning 中，我们创建一个 loss function 衡量 Q-value 预测值和目标值之间的差距，并使用梯度下降更新 Deep Q-Learning 网络的权重，使 DQN 预测 Q-value 更准确

![[pic-20250318091123070.png]]

Deep Q-Learning 训练算法有两个阶段：
- 采样（Sampling）：我们执行动作，并将观察到的经验元组（状态、动作、奖励、下一状态）存储在**回放内存 (Replay Memory)** 中
- 训练（Training）：从回放内存中随机选择一小批元组，利用这批数据通过梯度下降更新

![[pic-20250318093005524.png]]

与 Q-Learning 相比，这还不是唯一的区别。Deep Q-Learning 的训练可能会不稳定，主要原因在于 Deep Q-Learning 结合了非线性 Q-value 函数（神经网络）和自举法（bootstrapping）（即我们用现有的估计值来更新目标，而不是使用实际的完整回报）

为了帮助稳定训练，我们采用三种不同的解决方案：
- 经验回放（Experience Replay）：可以更高效地利用经验数据
- 固定 Q 目标（Fixed Q-Target）：稳定训练过程
- 双深度 Q-Learning（Double Deep Q-Learning）：解决 Q-value 估计值偏高的问题

### 经验回放（Experience Replay）

为什么我们要创建一个 replay memory？经验回放在 Deep Q-Learning 中有两个作用：

1. 在训练期间更有效的利用经验。通常在 online reinforcement learning 中，agent 使用每回合交互得到的经验更新参数，但造成了