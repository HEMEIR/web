#!/usr/bin/env python3
import os
import sys
import json

try:
    import vyper.ast.parse as vyper_parser
except ImportError:
    print("请先安装 vyper: pip install vyper")
    sys.exit(1)

def vyper_ast_to_dict(node):
    """
    将 Vyper AST 节点转换为字典格式，确保最终结果可以 JSON 序列化。
    针对 vyper.ast.nodes 中的节点，通过 __slots__ 获取字段值，
    同时如果存在 body 属性，也将其转换加入。
    """
    if isinstance(node, (str, int, float, bool)) or node is None:
        return node
    if isinstance(node, list):
        return [vyper_ast_to_dict(item) for item in node]
    if isinstance(node, dict):
        return {k: vyper_ast_to_dict(v) for k, v in node.items()}
    if node.__class__.__module__.startswith("vyper.ast.nodes"):
        result = {}
        # 如果节点有 body 属性，显式加入
        if hasattr(node, "body"):
            result["body"] = vyper_ast_to_dict(getattr(node, "body"))
        # 遍历 __slots__ 中的其他字段
        slots = getattr(node, "__slots__", [])
        for field in slots:
            if field == "body":
                continue
            try:
                value = getattr(node, field)
                result[field] = vyper_ast_to_dict(value)
            except Exception:
                result[field] = None
        result["__type__"] = node.__class__.__name__
        return result
    try:
        return vyper_ast_to_dict(vars(node))
    except Exception:
        return str(node)

def count_ast_vyper(node):
    """
    递归统计 Vyper AST 节点数，改进版：
    如果节点具有 body 属性，则递归统计 body 内的所有节点。
    """
    if isinstance(node, (str, int, float, bool)) or node is None:
        return 0
    if isinstance(node, list):
        return sum(count_ast_vyper(item) for item in node)
    # 计当前节点
    count = 1
    # 如果节点有 body 属性，则统计 body 内的节点
    if hasattr(node, "body"):
        count += count_ast_vyper(getattr(node, "body"))
    # 遍历其他 __slots__ 字段（排除 body 已处理部分）
    if hasattr(node, "__slots__"):
        slots = getattr(node, "__slots__")
        for field in slots:
            if field == "body":
                continue
            try:
                value = getattr(node, field)
                count += count_ast_vyper(value)
            except Exception:
                continue
    return count

def print_ast_vyper(file_path):
    """
    解析指定的 Vyper 文件，生成 AST，并以 JSON 格式打印出来。
    """
    with open(file_path, "r", encoding="utf-8") as f:
        source = f.read()
    try:
        ast_obj = vyper_parser.parse_to_ast(source)
    except Exception as e:
        print(f"解析 Vyper 文件 {file_path} 时出错: {e}")
        return
    print("\n===== Vyper 文件 AST 结构 =====")
    try:
        ast_dict = vyper_ast_to_dict(ast_obj)
        ast_json = json.dumps(ast_dict, indent=2)
        print(ast_json)
    except Exception as e:
        print(f"转换 AST 为 JSON 时出错: {e}")

def count_nodes(file_path):
    """
    解析 Vyper 文件，返回 AST 节点数。
    """
    with open(file_path, "r", encoding="utf-8") as f:
        source = f.read()
    try:
        ast_obj = vyper_parser.parse_to_ast(source)
    except Exception as e:
        print(f"解析 Vyper 文件 {file_path} 时出错: {e}")
        return 0
    return count_ast_vyper(ast_obj)

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
                cnt = count_nodes(full_path)
                results.append((full_path, cnt))
                print(f"处理 {full_path}: {cnt} 个 AST 节点")
    try:
        with open(output_file, "w", encoding="utf-8") as out:
            for path, cnt in results:
                out.write(f"{path}\t{cnt}\n")
        print(f"结果已写入文件: {output_file}")
    except Exception as e:
        print(f"写入结果文件 {output_file} 时出错: {e}")

def main():
    vyper_dir = "vyper_files"         # 修改为存放 Vyper 文件的目录
    vyper_output = "vyper_results.txt" # 结果输出文件

    if os.path.isdir(vyper_dir):
        print(f"正在处理 Vyper 文件目录: {vyper_dir}")
        process_directory(vyper_dir, ".vy", vyper_output)
        # 打印目录中第一个 Vyper 文件的 AST 结构
        for file in os.listdir(vyper_dir):
            if file.endswith(".vy"):
                file_path = os.path.join(vyper_dir, file)
                print_ast_vyper(file_path)
                break
    else:
        print(f"目录 {vyper_dir} 不存在！")

if __name__ == "__main__":
    main()
