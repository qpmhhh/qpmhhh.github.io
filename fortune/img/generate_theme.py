import os
import json

def generate_json():
    # 获取当前目录
    current_dir = os.getcwd()
    # 创建一个列表来存储所有子文件夹的信息
    folders_info = []

    # 遍历当前目录下的所有子文件夹
    for folder_name in os.listdir(current_dir):
        folder_path = os.path.join(current_dir, folder_name)
        # 检查是否是子文件夹
        if os.path.isdir(folder_path):
            # 获取子文件夹内的所有文件名
            images = [file for file in os.listdir(folder_path) if os.path.isfile(os.path.join(folder_path, file))]
            # 创建字典
            folder_info = {
                "name": folder_name,
                "flag": True,
                "images": images
            }
            # 将字典添加到列表中
            folders_info.append(folder_info)

    # 将列表转换为JSON格式并保存到文件
    json_file_path = os.path.join(current_dir, "themes.json")
    with open(json_file_path, "w", encoding="utf-8") as json_file:
        json.dump(folders_info, json_file, ensure_ascii=False, indent=4)

    print(f"JSON文件已生成并保存到 {json_file_path}")

# 调用函数
generate_json()
