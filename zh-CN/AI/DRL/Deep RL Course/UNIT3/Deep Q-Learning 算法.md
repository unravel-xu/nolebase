# Deep Q-Learning 算法

我们知道 Deep Q-Learning 使用深度神经网络来近似每个状态下可能动作的不同 Q-value（value-function 估计）

和 Q-Learning 区别在于，训练阶段，我们不会直接更新 state-action pair 的 Q-value

![[pic-20250318090714506.png]]

Q-Learning 中，我们用 $TD \ Target - Q\left(S_{t},\ A_{t}\right)$ 衡量 Q-value 预测值和目标值之间的差距

Deep Q-Learning 中，我们创建一个 loss function 衡量 Q-value 预测值和目标值之间的差距，并使用梯度下降更新 Deep Q-Learning 网络的权重，使 DQN 预测 Q-value 更准确

![[pic-20250318091123070.png]]

Deep Q-Learning 训练算法有两个阶段：
- 采样（Sampling）：我们执行动作并存储观测