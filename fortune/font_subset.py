import os
import re

# 读入目标文本内容
with open('./copywriting.json', encoding='utf-8') as t:
    source_content = t.read()
with open('./special_dec.json', encoding='utf-8') as t:
    source_content += t.read()

    
# 模拟执行pyftsubset命令生成字体子集
os.system(
    'pyftsubset sakura.ttf --text={} --output-file=sakura.ttf'.format(
        # 去除空白字符后去重
        ''.join(set(re.sub('\s', '', source_content)))
    )
)
