# Deep Q-Network(DQN)

如下是 Deep Q-Learning 网络的结构：

![[pic-20250317204149456.png]]

我们将 4 帧图像堆叠起来作为一个状态输入，传递给神经网络，神经网络会输出该状态下每个可能动作的 Q-value 向量。然后和 Q-Learning 一样，使用 epsilon-greedy policy 选取动作

当神经网络初始化时，Q 值的估计是非常不准确的。但是随着训练进行，DQN（Deep Q-Network）智能体会将当前状态与合适的动作关联起来，并学会如何玩好游戏

## 预处理输入和时序限制

我们需要预处理输入，通过减少状态的复杂度从而减少训练的计算时间

游戏画面的颜色其实并不重要，所以我们可以将 3 通道（RGB）灰度化降低到 1 通道。游戏画面的空白部分对游戏进行也不起作用，我们进一步可以将 $160\times210$ 大小的画面缩小到 $84\times84$

![[pic-20250317233307012.png]]

如上图，我们将 4 张缩小的画面堆叠起来，之所以要堆叠帧，是因为连续的帧隐含时序信息，输入堆叠帧可以帮我们处理时序限制问题。我们以 Pong 游戏举例：

![[pic-20250317233728093.png]]

从上图中能知道小球运动方向吗？显然不能，单独的帧没有足够的前后运动信息

![[pic-20250317233845117.png]]

但给定连续的三个帧（从左到右），我们可以知道小球要向右方向运动

所以将连续的四帧堆叠起来，可以获知时序信息

接下来，堆叠的帧经过 3 个卷积层处理。这些卷积层可以让我们捕捉和利用图像中的空间关系。同时由于帧是堆叠在一起的，我们还可以利用这些帧之间的时序特性

关于卷积层的介绍，可以学习 [Udacity 的深度学习课程第四课（免费课程）](https://www.udacity.com/course/deep-learning-pytorch--ud188)

最后，我们通过几个全连接层，输出该状态下每个可能动作的 Q-value

![[pic-20250317235905929.png]]

以上，我们了解了 Deep Q-Learning 使用神经网络来近似给定状态下可能动作的 Q-value，下面我们学习 Deep Q-Learning 算法
