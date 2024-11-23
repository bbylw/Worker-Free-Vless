// 常量配置
const CONFIG = {
  API: {
    KEY_SERVER: 'https://key.enkelte.ggff.net/',
    VLESS_SERVER: 'https://vless.enkelte.ggff.net/vless_list'
  }
};

// AES 解密工具
class AESDecryptor {
  static async decrypt(data, key, iv) {
    try {
      const keyBuffer = new TextEncoder().encode(key);
      const ivBuffer = new TextEncoder().encode(iv);
      const dataBuffer = this.hexToUint8Array(data);
      const cryptoKey = await crypto.subtle.importKey(
        'raw', keyBuffer, { name: 'AES-CBC' }, false, ['decrypt']
      );
      const decryptedData = await crypto.subtle.decrypt(
        { name: 'AES-CBC', iv: ivBuffer }, cryptoKey, dataBuffer
      );
      return new TextDecoder().decode(decryptedData);
    } catch (error) {
      throw new Error(`解密失败: ${error.message}`);
    }
  }

  static hexToUint8Array(hex) {
    try {
      const view = new Uint8Array(hex.length / 2);
      for (let i = 0; i < hex.length; i += 2) {
        view[i / 2] = parseInt(hex.substr(i, 2), 16);
      }
      return view;
    } catch (error) {
      throw new Error(`转换失败: ${error.message}`);
    }
  }
}

// VLESS链接格式化
function formatVlessLink(node) {
  try {
    const params = new URLSearchParams({
      security: node.security || '',
      sni: node.sni || '',
      fp: node.fingerprint || '',
      type: node.type || '',
      path: node.path || '',
      host: node.host || '',
      packetEncoding: node.packetEncoding || '',
      encryption: node.encryption || ''
    });
    
    return `${node.protocol}://${node.uuid}@${node.address}:${node.port}?${params.toString()}#${node.hostname}`;
  } catch (error) {
    throw new Error(`格式化链接失败: ${error.message}`);
  }
}

// 添加 UTF-8 编码处理函数
function utf8ToBase64(str) {
  try {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
      function toSolidBytes(match, p1) {
        return String.fromCharCode('0x' + p1);
      }));
  } catch (error) {
    throw new Error(`Base64编码失败: ${error.message}`);
  }
}

// 生成HTML页面
const generateHTML = () => `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VLess Share Hub</title>
    <style>
        :root {
            --ph-orange: #ff9000;
            --ph-black: #000000;
            --ph-dark: #1b1b1b;
            --ph-white: #ffffff;
        }
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: Arial, sans-serif;
            background: var(--ph-black);
            color: var(--ph-white);
        }
        .header {
            background: var(--ph-dark);
            padding: 1rem;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }
        .nav {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .logo {
            font-size: 2rem;
            font-weight: bold;
        }
        .logo span {
            color: var(--ph-orange);
        }
        .main {
            max-width: 1200px;
            margin: 2rem auto;
            padding: 0 1rem;
        }
        .tools-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 1.5rem;
            margin-top: 2rem;
        }
        .tool-card {
            background: var(--ph-dark);
            border-radius: 8px;
            padding: 1.5rem;
            transition: transform 0.2s;
        }
        .tool-card:hover {
            transform: translateY(-5px);
        }
        .tool-title {
            color: var(--ph-orange);
            font-size: 1.5rem;
            margin-bottom: 1rem;
        }
        .tool-description {
            margin-bottom: 1rem;
            line-height: 1.6;
        }
        .tool-link {
            display: inline-block;
            background: var(--ph-orange);
            color: var(--ph-black);
            padding: 0.5rem 1rem;
            border-radius: 4px;
            text-decoration: none;
            font-weight: bold;
        }
        .subscribe-btn {
            background: var(--ph-orange);
            color: var(--ph-black);
            padding: 0.5rem 1.5rem;
            border-radius: 4px;
            text-decoration: none;
            font-weight: bold;
        }
        .intro {
            text-align: center;
            margin: 2rem 0;
            padding: 2rem;
            background: var(--ph-dark);
            border-radius: 8px;
        }
        .intro h1 {
            color: var(--ph-orange);
            margin-bottom: 1rem;
        }
    </style>
</head>
<body>
    <header class="header">
        <nav class="nav">
            <div class="logo">VLess<span>Share</span></div>
            <a href="/" class="subscribe-btn" id="subscribe-btn">一键订阅</a>
        </nav>
    </header>
    
    <main class="main">
        <div class="intro">
            <h1>免费高速节点</h1>
            <p>50个高速节点 | 定时更新 | 支持多客户端</p>
        </div>
        
        <div class="tools-grid">
            <div class="tool-card">
                <h3 class="tool-title">v2rayN</h3>
                <p class="tool-description">Windows平台最受欢迎的代理工具，界面简洁，功能强大。支持多种协议，可自定义路由规则。</p>
                <a href="https://github.com/2dust/v2rayN" class="tool-link" target="_blank">项目主页</a>
            </div>
            
            <div class="tool-card">
                <h3 class="tool-title">Hiddify</h3>
                <p class="tool-description">跨平台客户端，支持 Windows/MacOS/Linux/Android/iOS，界面美观，使用简单。</p>
                <a href="https://github.com/hiddify/hiddify-app" class="tool-link" target="_blank">项目主页</a>
            </div>
            
            <div class="tool-card">
                <h3 class="tool-title">Karing</h3>
                <p class="tool-description">iOS平台优秀的代理工具，支持多种协议，可通过TestFlight安装。</p>
                <a href="https://github.com/KaringX/karing" class="tool-link" target="_blank">项目主页</a>
            </div>
            
            <div class="tool-card">
                <h3 class="tool-title">FClash</h3>
                <p class="tool-description">基于 Clash 内核的代理工具，支持策略分组，界面美观，规则丰富。</p>
                <a href="https://github.com/chen08209/FlClash" class="tool-link" target="_blank">项目主页</a>
            </div>
        </div>
    </main>

    <script>
        document.getElementById('subscribe-btn').onclick = function(e) {
            e.preventDefault();
            window.location.href = window.location.href + '?token=subscribe';
        };
    </script>
</body>
</html>
`;

// 修改主处理函数
async function handleRequest(request) {
    const url = new URL(request.url);
    
    // 如果有token参数，返回订阅内容
    if (url.searchParams.has('token')) {
        try {
            // 获取密钥
            const keyResponse = await fetch(CONFIG.API.KEY_SERVER);
            if (!keyResponse.ok) {
                throw new Error(`获取密钥失败: ${keyResponse.status}`);
            }
            const { key, iv } = await keyResponse.json();

            // 获取加密数据
            const vlessResponse = await fetch(CONFIG.API.VLESS_SERVER);
            if (!vlessResponse.ok) {
                throw new Error(`获取节点数据失败: ${vlessResponse.status}`);
            }
            const encryptedData = await vlessResponse.text();

            // 解码和解密
            const decodedData = atob(encryptedData);
            const decryptedJson = await AESDecryptor.decrypt(decodedData, atob(key), atob(iv));
            const resultData = JSON.parse(decryptedJson);

            // 检查数据结构
            if (!resultData.data || !Array.isArray(resultData.data)) {
                throw new Error('无效的节点数据格式');
            }

            // 格式化链接
            const vlessLinks = resultData.data.map(formatVlessLink);
            const resultString = vlessLinks.join('\n');
            
            // 使用新的 UTF-8 编码函数
            const base64Encoded = utf8ToBase64(resultString);
            
            return new Response(base64Encoded, {
                headers: {
                    'Content-Type': 'text/plain; charset=utf-8',
                    'Cache-Control': 'no-cache',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        } catch (error) {
            console.error('详细错误:', error);
            return new Response(`处理请求失败: ${error.message}`, { 
                status: 500,
                headers: {
                    'Content-Type': 'text/plain; charset=utf-8',
                    'Cache-Control': 'no-cache',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }
    }
    
    // 否则返回HTML页面
    return new Response(generateHTML(), {
        headers: { 'Content-Type': 'text/html;charset=UTF-8' }
    });
}

// 事件监听器
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});
