import os

def generate_ascii_tree(directory, prefix=""):
    tree_structure = ""
    items = sorted(os.listdir(directory))  # 정렬된 항목 가져오기
    
    # 숨김 파일과 'node_modules' 폴더를 제외
    items = [item for item in items if not item.startswith('.') and item != 'node_modules']
    
    for i, item in enumerate(items):
        path = os.path.join(directory, item)
        connector = "└── " if i == len(items) - 1 else "├── "
        tree_structure += f"{prefix}{connector}{item}\n"
        
        # 하위 디렉토리로 재귀적으로 들어가기
        if os.path.isdir(path):
            extension = "    " if i == len(items) - 1 else "│   "
            tree_structure += generate_ascii_tree(path, prefix + extension)
    return tree_structure

def save_tree_to_file(directory, output_file="tree.txt"):
    ascii_tree = generate_ascii_tree(directory)
    with open(output_file, "w", encoding="utf-8") as f:
        f.write(ascii_tree)

# 사용 예시: 현재 디렉토리부터 하위 구조를 tree.txt에 저장
directory = "."  # 시작할 디렉토리
save_tree_to_file(directory, "tree.txt")