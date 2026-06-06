import pdfplumber

pdf_path = r"C:\Users\为梦\Downloads\前端api文档v1.0.pdf"

with pdfplumber.open(pdf_path) as pdf:
    full_text = ""
    for i, page in enumerate(pdf.pages):
        text = page.extract_text()
        if text:
            full_text += f"\n=== 第 {i+1} 页 ===\n{text}\n"
    
    # 保存到文件
    with open(r"D:\资源\编程\demo1\frontend-vue\pdf_content.txt", "w", encoding="utf-8") as f:
        f.write(full_text)
    
    print(f"已提取 {len(pdf.pages)} 页内容")
    print("保存到: D:\\资源\\编程\\demo1\\frontend-vue\\pdf_content.txt")
    
    # 查找"获取文章阅读详情"
    if "获取文章阅读详情" in full_text:
        print("\n找到 '获取文章阅读详情' 相关内容:")
        lines = full_text.split("\n")
        for i, line in enumerate(lines):
            if "获取文章阅读详情" in line or "文章详情" in line:
                # 打印上下文
                start = max(0, i - 5)
                end = min(len(lines), i + 20)
                print(f"\n--- 上下文 (行 {i+1}) ---")
                for j in range(start, end):
                    print(lines[j])
                break
