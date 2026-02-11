#!/usr/bin/env python3
import os
import sys
import json
from solidity_parser import parser

def count_ast_solidity(ast_dict):
    """
    递归统计 Solidity AST 中的节点数：
    如果字典中存在 "type" 键，则认为这是一个 AST 节点。
    """
    if isinstance(ast_dict, dict):
        count = 1 if "type" in ast_dict else 0
        for key, value in ast_dict.items():
            if isinstance(value, list):
                for item in value:
                    count += count_ast_solidity(item)
            elif isinstance(value, dict):
                count += count_ast_solidity(value)
        return count
    elif isinstance(ast_dict, list):
        return sum(count_ast_solidity(item) for item in ast_dict)
    else:
        return 0

def print_ast_solidity(file_path):
    """
    解析指定 Solidity 文件，并以 JSON 格式打印 AST 结构。
    """
    try:
        ast_dict = parser.parse_file(file_path)
    except Exception as e:
        print(f"解析 Solidity 文件 {file_path} 时出错: {e}")
        return
    print("\n===== Solidity 文件 AST 结构 =====")
    try:
        ast_json = json.dumps(ast_dict, indent=2)
        print(ast_json)
    except Exception as e:
        print(f"转换 AST 为 JSON 时出错: {e}")

def count_nodes(file_path):
    """
    解析 Solidity 文件，返回 AST 节点数。
    """
    try:
        ast_dict = parser.parse_file(file_path)
    except Exception as e:
        print(f"解析 Solidity 文件 {file_path} 时出错: {e}")
        return 0
    return count_ast_solidity(ast_dict)

def process_directory(directory, extension, output_file):
    """
    遍历目录（包含子目录）中所有指定后缀的文件，
    统计每个文件的 AST 节点数，并将结果写入 output_file 文件中。
    """
    results = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(extension):
                full_path = os.path.join(root, file)
                count = count_nodes(full_path)
                results.append((full_path, count))
                print(f"处理 {full_path}: {count} 个 AST 节点")
    try:
        with open(output_file, "w", encoding="utf-8") as out:
            for path, count in results:
                out.write(f"{path}\t{count}\n")
        print(f"结果已写入文件: {output_file}")
    except Exception as e:
        print(f"写入结果文件 {output_file} 时出错: {e}")

def main():
    # 请根据实际情况修改目录
    solidity_dir = "solidity_files"         # Solidity 文件所在目录
    solidity_output = "solidity_results.txt"  # 结果输出文件

    if os.path.isdir(solidity_dir):
        print(f"正在处理 Solidity 文件目录: {solidity_dir}")
        process_directory(solidity_dir, ".sol", solidity_output)
        # 打印目录中第一个 Solidity 文件的 AST 结构
        for file in os.listdir(solidity_dir):
            if file.endswith(".sol"):
                file_path = os.path.join(solidity_dir, file)
                print_ast_solidity(file_path)
                break
    else:
        print(f"目录 {solidity_dir} 不存在！")

if __name__ == "__main__":
    main()
