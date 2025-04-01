#LLM #LLM可解释性

该讲是关于语言模型内部运作机制的剖析——从一个神经元到一层神经元再到一群神经元

## 一个神经元的功能

可以观察某个神经元被激活时，语言模型的输出，例如神经元被激活，观察到语言模型输出脏话

![[pic-20250331165848653.png]]

但注意：**只能说这个神经元和说脏话可能具有相关性，而不能直接说有因果关系**

例如冰淇淋销量与溺水事件数量呈正相关。但这并不意味着冰淇淋销量导致溺水，根本原因是天气炎热，导致冰淇淋消费量增加，游泳的人也更多，从而增加了溺水风险。在这种情况下，炎热的天气充当了混杂变量

所以我们需要移除该神经元，并观察语言模型的输出。如果移除后，语言模型不再说脏话，则说明可能有因果关系

> [!important]
> 如何移除神经元？

1. 直接将该神经元的输出永远设为 0 ？
	但直接设为 0，可能会导致其他神经元被激活
2. 统计该神经元在语言模型接收各种输入时的权值，并用权值的均值来替代？

这个问题尚待研究

再进一步，通过调节神经元的启动程度（输出大小），观察语言模型的输出是否是不同程度的脏话

### 川普神经元

[Multimodal Neurons in Artificial Neural Networks](https://distill.pub/2021/multimodal-neurons/)

![[pic-20250331181555488.png]]

横坐标表示神经元被启动的程度，可以发现当给出川普图片时（红色区域）神经元启动程度高

人类脑科学中，也虚构过单一神经元负责一个任务的概念：[祖母神经元](https://zhuanlan.zhihu.com/p/92301976)

### 神经元和任务的关系

显然，上述是理想情况，实际中一件事情可能由很多神经元共同管理

在论文 [What does the Knowledge Neuron Thesis Have to do with Knowledge?](https://arxiv.org/abs/2405.02421) 中发现 GPT2 的某一层神经元控制模型输出文法的单复数

![[pic-20250331195611564.png]]

论文中使用梯度均值替代神经元，发现 this、that、these、those 输出概率变化

虽然“擦除”神经元可以改变输出概率，但整个模型的最终输出多数情况下不会发生变化：

![[pic-20250331200412870.png]]

如图，经过 post-edit，these、those 概率下降，this、that 概率上升，但 these、those 下降后的输出概率仍大于 this、that 的输出概率

一件事情可能由很多神经元共同管理，同样一个神经元也可能参与管理多件事情

[monosemantic-features](https://transformer-circuits.pub/2023/monosemantic-features/vis/a-neurons.html) 可视化了每个神经元参与的输出

或许一个任务由一组神经元完成，不同的任务会共用神经元，这也是为什么 LLM 可以用有限的神经元完成所有任务

## 一层神经元的功能

假设：每一个功能都由一组神经元组合构成，这些神经元的数值可以看成一个向量，假定为功能向量

抽取功能向量：

先输入大量会产生拒绝的语句，得到拒绝向量+其他平均向量

![[pic-20250401115441944.png]]

再输入大量不会产生拒绝的语句，得到其他平均向量，两者做差：

![[pic-20250401115706837.png]]

![[pic-20250401115828620.png]]

得到拒绝向量后，继续验证拒绝向量：

![[pic-20250401120320121.png]]

我们将拒绝向量加到某层正常向量中，观察本不应被拒绝的输入是否会被拒绝

在论文 [Refusal in Language Models Is Mediated by a Single Direction](https://arxiv.org/abs/2406.11717) 中：

![[pic-20250401123643149.png]]

红色部分是加入拒绝向量后模型的输出

我们可以加入拒绝向量观察输出，同样也可以“减去”拒绝向量：

![[pic-20250401153258921.png]]

实际的处理方法有很多种，“直接减去”是最简单的方法。如果减去后，本该被拒绝的输入不再被拒绝，同样可以证明功能向量的有效性

![[pic-20250401154737112.png]]

操作功能向量有很多名字：Representation Engineering，Activation Engineering，Activation Steering……

在论文 [Steering Llama 2 via Contrastive Activation Addition](https://arxiv.org/abs/2312.06681) 中，研究人员找到了 Sycophancy Vector（谄媚向量）

![[pic-20250401155250113.png]]

更多的论文：

- [TruthX: Alleviating Hallucinations by Editing Large Language Models in Truthful Space](https://arxiv.org/abs/2402.17811)
- [Inference-Time Intervention: Eliciting Truthful Answers from a Language Model](https://arxiv.org/abs/2306.03341)
- [Function Vectors in Large Language Models](https://arxiv.org/abs/2310.15213)
- [In-Context Learning Creates Task Vectors](https://arxiv.org/abs/2310.15916)
- [In-context Vectors: Making In Context Learning More Effective and Controllable Through Latent Space Steering](https://arxiv.org/abs/2311.06668)

能否自动把某一层的所有功能向量都找出来呢？

[Towards Monosemanticity: Decomposing Language Models With Dictionary Learning](https://transformer-circuits.pub/2023/monosemantic-features/index.html)

提出假设：当神经网络要表达的 feature 数量大于神经元数量，则 feature 会通过神经元的线性组合表达。如果我们将每个 feature 看作神经元上的向量，那么 feature 的集合就形成了网络中激活神经元的过完备线性基（overcomplete linear basis，也就是基元素的个数比维数要大

![[pic-20250401175731641.png]]

我们希望通过 h 向量求解出 v 向量，如果不加限制，显然会有无穷多解。于是我们添加如下两个限制条件：
1. 我们要保证误差向量尽可能的小
2. 我们要保证每个 h 向量都用尽可能少的 v 向量表达

![[pic-20250401181005565.png]]

Claude 3 团队通过 SAE 求解得到一系列功能向量：[Scaling Monosemanticity: Extracting Interpretable Features from Claude 3 Sonnet](https://transformer-circuits.pub/2024/scaling-monosemanticity/)

![[pic-20250401185247682.png]]

上图是编号 31164353 的功能向量，负责输出关于金门大桥的内容

 论文 [Gemma Scope: Open Sparse Autoencoders Everywhere All At Once on Gemma 2](https://arxiv.org/abs/2408.05147) 分析了 Gemma 2 的功能向量（[可视化分析](https://www.neuronpedia.org/gemma-scope#analyze)）

## 一群神经元的功能

