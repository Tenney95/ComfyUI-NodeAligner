import os
# 插件的节点映射，可以不定义任何节点
NODE_CLASS_MAPPINGS = {}

# 确保前端文件的路径正确
current_directory = os.path.dirname(os.path.abspath(__file__))
# 打印输出当前目录
WEB_DIRECTORY = os.path.join(current_directory)
