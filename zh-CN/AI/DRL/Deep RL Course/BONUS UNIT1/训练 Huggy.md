# 训练 Huggy

同样我们使用 Google Colab 进行实验：<a href="https://colab.research.google.com/github/huggingface/deep-rl-class/blob/master/notebooks/bonus-unit1/bonus-unit1.ipynb" rel="nofollow"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open In Colab"></a>

## 训练相关

最终要实现的效果如下：

<video controls autoplay><source src="https://huggingface.co/datasets/huggingface-deep-rl-course/course-images/resolve/main/en/notebooks/unit-bonus1/huggy.mp4" type="video/mp4"></video>

训练环境：Huggy the Dog

相关库：[MLAgents](https://github.com/Unity-Technologies/ml-agents)

一些准备工作不再赘述

## 配置虚拟环境

首先 clone ML-Agents 的仓库

```bash
# Clone the repository (can take 3min)
git clone --depth 1 https://github.com/Unity-Technologies/ml-agents
```

检查 ML-Agents 需要的 python 版本：在文件 setup.py 中查看参数 python_requires，路径为：
- /content/ml-agents/ml-agents/setup.py
- /content/ml-agents/ml-agents-envs/setup.py

![[pic-20250313104255073.png]]

![[pic-20250313104408521.png]]

查看当前 Colab 的 Python 版本：`!python --version`，如果 python 版本不匹配，执行代码可能会出现如下报错：
- /bin/bash: line 1: mlagents-learn: command not found
- /bin/bash: line 1: mlagents-push-to-hf: command not found

我们创建一个虚拟环境解决这个问题：

```bash
# 安装并创建虚拟环境
!pip install virtualenv
!virtualenv myenv

# 安装Miniconda
!wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
!chmod +x Miniconda3-latest-Linux-x86_64.sh
!./Miniconda3-latest-Linux-x86_64.sh -b -f -p /usr/local

# 激活Miniconda并安装Python 3.10.12
!source /usr/local/bin/activate
!conda install -q -y --prefix /usr/local python=3.10.12 ujson

# 配置环境变量
!export PYTHONPATH=/usr/local/lib/python3.10/site-packages/
!export CONDA_PREFIX=/usr/local/envs/myenv
```

## 安装依赖


