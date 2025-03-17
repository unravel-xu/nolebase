# Q-Learning到Deep Q-Learning

我们用 Q-Learning 算法训练 Q-function，Q-function 是一种 action-value function，它给出了某状态下采取某动作的 value

![[pic-20250317113634324.png]]

其中字母 Q 来源于 "the Quality" of that action at that state

在 Q-function 内部有一个 Q-table，Q-table 的行、列分别由 state、action 构成，我们可以把 Q-table 想像成 Q-function 的记忆或备忘录

但 Q-Learning 作为表格型方法存在一些问题：如果 states spaces 和 actions spaces 很大，就无法用数组和表格高效表示。换而言之，Q-Learning 不具有良好的扩展性，它只适用于状态空间较小的环境中：
- FrozenLake，共有 16 个状态
- Taxi-v3，共有 500 个状态

但我们今天要训练 Agent 学习玩太空入侵者（Space Invaders），游戏的每一帧都作为一个状态输入，总的状态空间非常大

[Nikita Melkozerov](https://twitter.com/meln1k) 说过，雅达利游戏单帧图像由 $210\times160$ 个像素组成，由于图像是彩色的（RGB），因此每个图像有 3 个通道，每个通道各有 256 级亮度。每个像素共 $256\times256\times256 = 256^{3}$ 种可能，所有可能的帧共 $256^{3\times210\times160}$，也就是说可能的 observations 有 $256^{100800}$ 种

