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

[Dissecting Recall of Factual Associations in Auto-Regressive Language Models](https://arxiv.org/abs/2304.14767)

![[pic-20250401190653015.png]]

[A Mechanistic Interpretation of Arithmetic Reasoning in Language Models using Causal Mediation Analysis](https://arxiv.org/abs/2305.15054)

![[pic-20250401190743362.png]]

但这都是对特定模型的分析，如何找到一种通用方法？

模型可以认为是用一个较为简单的东西来代表另一个复杂的东西

例如语言模型是对人类真正语言的简化，**语言模型的模型**是对语言模型的简化：

![[pic-20250402153445460.png]]

模型可以突出重点，降低理解门槛，使我们更容易抓住事物的本质

语言模型的模型的特点：
1. 要比语言模型简单
2. 保持原语言模型的特征（faithfulness）

论文 [Linearity of Relation Decoding in Transformer Language Models](https://arxiv.org/abs/2308.09124) 中，提出了用一个线性函数代替原语言模型部分层的输出：

![[pic-20250402155105863.png]]

观察图中红色部分，输入 The Taipei 101 is located in，假设用 Linear Function 就可以表达 “is located in” 关系，那么主语无论是 The Taipei 101 还是 The Space Needle，只要谓语不变，我们就认为 Linear Function 参数不变

![[pic-20250402160350037.png]]

当谓语发生变化，虽然还是 Linear Function，但此时参数应该发生变化：$W_{l},b_{l}\to W_{t}, b_{h}$

上述假设 Linear Function 可以代替语言模型的 layer，下面就需要验证这种假设是否成立：

这也是判断 Linear Function 的 faithfulness，先用一部分数据作为训练资料训练出 Linear Function，再用剩余数据作为测试资料查看训练好的 Linear Function 和原语言模型的输出是否相同

![[pic-20250402161304575.png]]

最终结果显示一部分关系可以用 Linear Function 代替，例如 occupation gender 的 faithfulness 近乎 100%

既然一些关系可以用 Linear Function 代替，我们能否充分利用 Linear Function 的性质呢？

![[pic-20250402162642963.png]]

例如，Linear Function 可以求反函数，所以当我们改变模型输出结果时（如上图，将 Taipei 改为 Kaohsiung），可以反推出输入的 $x'$，进而求出 $\Delta x = x' - x$

因为我们用 Linear Function 替代原模型的 Layer，所以直接将 $\Delta x$ 加在 Layer 之间，原模型也该改变输出，这样就实现语言模型的编辑

为什么我们采用 Linear Function？实际是我们的猜测，有没有系统化构建语言模型的模型的方法呢？

可以直接对语言模型做 Pruning——不断删掉语言模型的 components，观察 faithfulness 是否变化，直到得到非常精简的模型，多数论文称为 Circuit

![[pic-20250402173022252.png]]

这个思想和 Network Compression 非常接近，区别在于 Network Compression 得到的模型需要在各个任务上和原模型接近，而 Circuit 得到的模型只需在一个简单任务（[IOI 问题](https://zhuanlan.zhihu.com/p/685224484)）上保持接近

## 让语言模型直接说出想法

kaiming 的经典论文 [Deep Residual Learning for Image Recognition](https://arxiv.org/abs/1512.03385) 中提出了 resnet：

![[pic-20250402174123333.png]]

这样看，似乎没什么特别的，不过是将 layer 前后的向量做了加法，但换个角度：

![[pic-20250402174740560.png]]

输入直通输出（residual stream），每经过一个 Layer 就会有一些信息加到 residual stream 中，既然最后输出经过 Unembedding 可以得到 token 概率分布，而中间层相比于最后一层只是少了后添加的信息，那同样我们可以对中间层做 Unembedding 得到概率分布（称为Logit Lens）

![[pic-20250402183805098.png]]

在论文 [Do Llamas Work in English? On the Latent Language of Multilingual Transformers](https://arxiv.org/abs/2402.10588) 中，发现 Llama 2 对于中文回答法语问题是先将法语转为英语思考，再将英语转为中文

 论文 [Transformer Feed-Forward Layers Are Key-Value Memories](https://arxiv.org/abs/2012.14913) 给出了一种新的视角理解 FFN

![[pic-20250402200137720.png]]

FFN 中某个神经元是前一层所有神经元的加权和，如果转变视角：

![[pic-20250402200456460.png]]

前一层的每个神经元参与了后一层每个神经元的计算，前一层的每个神经元就可以视作 attention 中的 key，权重就可以视作 value

论文 [Transformer Feed-Forward Layers Build Predictions by Promoting Concepts in the Vocabulary Space](https://arxiv.org/abs/2203.14680) 就发现这些权重是有意义的：

![[pic-20250402200916751.png]]

既然权重是有意义的，同样我们可以修改这些权重来影响语言模型的输出：

![[pic-20250402201248641.png]]

Logit Lens 存在致命缺陷：
1. 一次只能编辑一个 token
2. LLM 多数情形是根据输入 token 预测输出，也就是说 layer 的输出不代表输入 token 的含义，而可能代表根据输入 token 产生的预测 token

![[pic-20250402215322502.png]]

论文 [Patchscopes: A Unifying Framework for Inspecting Hidden Representations of Language Models](https://arxiv.org/abs/2401.06102) 提出了一个解决方法

论文 [Hopping Too Late: Exploring the Limitations of Large Language Models on Multi-Hop Queries](https://arxiv.org/abs/2406.12775) 借助 Patchscopes 的方法

这两篇论文值得仔细研究，因为通过 Patchscopes 我们可以判断数学题和代码题在 LLM 每层含义

论文 [Understanding and Patching Compositional Reasoning in LLMs](https://arxiv.org/abs/2402.14328) 似乎也和上述相关