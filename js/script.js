// 读取网页目录下的 file.json 文件，获取文件的路径，存储在一个变量中
function loadJSON(callback) {
  // 创建 XMLHttpRequest 对象以请求 JSON 文件
  var xhr = new XMLHttpRequest();
  xhr.overrideMimeType("application/json");
  xhr.open('GET', '../file.json', true); // 假设 file.json 存储在与 script.js 相同目录下
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      callback(JSON.parse(xhr.responseText));
    }
  };
  xhr.send(null);
}

// 调用上述变量，识别文件类型为.md的文件，在 <div id="mark_list"></div> 中列出文件的目录，只输出文件名，不输出路径
function listMarkdownFiles() {
  loadJSON(function (jsonData) {
    var files = jsonData.files; // 获取文件列表
    var markListDiv = document.getElementById('mark_list');
    markListDiv.innerHTML = ''; // 清空列表

    for (var fileName in files) {
      if (files.hasOwnProperty(fileName) && files[fileName].endsWith('.md')) {
        var filePath = files[fileName]; // 获取文件路径
        var listItem = document.createElement('div');
        // 显示文件名，并在点击时调用 loadMarkdown 函数
        listItem.innerHTML = `<a href="javascript:void(0);" onclick="loadMarkdown('${filePath}')">${fileName}</a>`;
        markListDiv.appendChild(listItem); // 将文件名添加到 <div> 中
      }
    }
  });
}

// function3: 点击上述函数中列出的目录中的文件，在 <div id="mark_view"></div> 渲染文件内容
function loadMarkdown(file) {
  // 如果文件是 GitHub 仓库中的网页路径，转换为原始文件内容的链接
  if (file.includes('github.com')) {
    file = file.replace('github.com', 'raw.githubusercontent.com')
      .replace('/blob/', '/');
  }

  var xhr = new XMLHttpRequest();
  xhr.open('GET', file, true); // 请求 markdown 文件
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      // 使用 marked.js 将 markdown 转换为 HTML
      document.getElementById('mark_view').innerHTML = marked.parse(xhr.responseText);
    }
  };
  xhr.send(null);
}


// 调试代码示例：页面加载时调用列出文件的函数
window.onload = function () {
  listMarkdownFiles(); // 页面加载完成后列出文件
};
