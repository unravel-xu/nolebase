# 学习 Transformer 可解释性的具体步骤

翻译自博文：[Concrete Steps to Get Started in Transformer Mechanistic Interpretability](https://www.neelnanda.io/mechanistic-interpretability/getting-started)

Transformer Mechanistic Interpretability 下简称为 Transformer MI，是一个相当前沿且小众的领域，关于这个领域的教育资源很匮乏，所以作者 [Neel Nanda](https://www.neelnanda.io/mechanistic-interpretability) 写了一系列的介绍博文

## 简介

您可以直接跳过简介阅读下方关于学习的具体步骤

这篇博文的目的是提供具体的步骤学习 Transformer 机制可解释性(Transformer MI)的基础知识。我尝试给出一些具体可行且目标明确的建议，您可以根据这些建议适当调整您的学习路径

我对学习 Transformer MI 有一个核心观点：您至少需要花费三分之一的时间编写代码和探索模型内部结构，而不仅仅是阅读论文。机制可解释性的学习是一个反馈循环过程，其中非常重要能力就是能够轻松编写和运行实验。与传统的机器学习不同，在掌握 MI 的基础知识后，您就可以在几分钟内用一个小模型进行简单的实验，而不用等待几小时甚至几天时间。此外，由于反馈循环非常紧密，我认为阅读学习和进行研究之间没有明显的区别。如果您想深入理解一篇论文，就应该动手尝试，并检验论文的结论是否正确

这篇博文的目标读者是刚接触机制可解释性但想要进一步学习的人——如果您完全不知道什么是机制可解释性，您可以参阅 [this Mech Interp Explainer](https://www.neelnanda.io/glossary)，[Circuits: Zoom In](https://distill.pub/2020/circuits/zoom-in/)，[Chris Olah’s overview post](https://www.lesswrong.com/posts/CzZ6Fch4JSpwCpu6C/interpretability)

## “不错水平”的标准

下面是我认为"不错的基础知识水平"的标准：

- 扎实掌握机器学习和机制可解释性的关键概念
- 了解 Transformer 实际运作的机制——了解其组成部分，各个组成部分如何协作，以及如何解释整个系统
- 熟悉相关工具，例如您可以快速运行一个模型并开展实验
- 对文献有一个大致了解，知道目前领域的进展和主要的未解决问题的类别——不一定需要深入的知识，但至少知道目前常用的技术，并清楚去哪里阅读相关的论文来深入学习
- 了解基础技术，明白哪些证据能可靠的揭示模型内部原理，以及在探究模型时如何着手

## 入门学习

[Callum McDougall](https://arena-ch1-transformers.streamlit.app/) 制作了一套关于机制可解释性和 TransformerLens 的优秀教程，包含练习、解答和图例。本节在很大程度上是对这些教程的一个注解说明！

### 学习机器学习的一般前提

对机器学习有一个基本的整体理解很重要。此外，熟悉 PyTorch 等机器学习框架对于实际编写代码以及巩固知识也至关重要

- 资源：阅读