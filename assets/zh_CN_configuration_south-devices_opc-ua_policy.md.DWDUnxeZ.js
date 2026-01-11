import{_ as i,c as a,o as n,ah as l}from"./chunks/framework.D2dsaVOY.js";const g=JSON.parse('{"title":"OPC UA 连接策略","description":"","frontmatter":{},"headers":[],"relativePath":"zh_CN/configuration/south-devices/opc-ua/policy.md","filePath":"zh_CN/configuration/south-devices/opc-ua/policy.md"}'),t={name:"zh_CN/configuration/south-devices/opc-ua/policy.md"};function p(h,s,e,k,r,F){return n(),a("div",null,[...s[0]||(s[0]=[l(`<h1 id="opc-ua-连接策略" tabindex="-1">OPC UA 连接策略 <a class="header-anchor" href="#opc-ua-连接策略" aria-label="Permalink to “OPC UA 连接策略”">​</a></h1><h2 id="客户端登录方式" tabindex="-1">客户端登录方式 <a class="header-anchor" href="#客户端登录方式" aria-label="Permalink to “客户端登录方式”">​</a></h2><ul><li><p>匿名方式</p><p>OPC UA 服务端需要开启匿名登录选项。</p><p>GridBeat OPC UA 模块无需设置用户名/密码和证书/密钥。</p></li><li><p>用户名/密码方式</p><p>OPC UA 服务端已经创建好具备访问权限的用户名/密码。</p><p>GridBeat OPC UA 模块填写对应的用户名/密码，无需添加证书/密钥。</p></li><li><p>证书/密钥 + 匿名方式</p><p>OPC UA 服务端开启合适的安全设置，添加客户端证书到信任列表，并且开启匿名登录。</p><p>GridBeat OPC UA 模块添加对应的客户端证书/密钥，无需填写用户名/密码。</p></li><li><p>证书/密钥 + 用户名/密码方式</p><p>OPC UA 服务端已经创建好具备访问权限的用户名/密码，开启合适的安全设置，并添加客户端证书到信任列表。</p><p>GridBeat OPC UA 模块添加对应的用户名/密码，添加对应的客户端证书/密钥。</p></li></ul><h2 id="客户端证书要求" tabindex="-1">客户端证书要求 <a class="header-anchor" href="#客户端证书要求" aria-label="Permalink to “客户端证书要求”">​</a></h2><p>OPC UA 可通过用户自签名证书登录到 OPC UA 服务器，Certificate 和 Key 必须满足以下条件：</p><ul><li><p>CERTIFICATE 和 KEYFILE 必须同时设置；</p></li><li><p>Certificate 必须以 X.509v3 标准生成；</p></li><li><p>Certficate 的 SAN 字段必须包含 <code>URI:urn:xxx.xxx.xxx</code>，<code>xxx</code> 为自定义部分；</p></li><li><p>Certificate 文件和 Key 文件必须使用 DER 格式编码。</p></li></ul><div class="tip custom-block"><p class="custom-block-title custom-block-title-default">TIP</p><p>证书文件可以提前导入到目标服务器中并设置为信任，也可以由 GridBeat 设置后自动提交再由服务端设置为信任。</p></div><h2 id="客户端证书-密钥转换" tabindex="-1">客户端证书/密钥转换 <a class="header-anchor" href="#客户端证书-密钥转换" aria-label="Permalink to “客户端证书/密钥转换”">​</a></h2><p>可以通过以下步骤和命令将 PEM 证书以及私钥转换为 DER 格式。</p><ol><li><p>将包括<code>-----BEGIN CERTIFICATE-----</code>和<code>-----END CERTIFICATE-----</code>的所有内容保存为 1.crt；</p></li><li><p>将包括<code>-----BEGIN PRIVATE KEY-----</code>和<code>-----END PRIVATE KEY-----</code>的所有内容保存为 1.key；</p></li><li><p>执行如下命令:</p></li></ol><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;user-select:none;-webkit-user-select:none;">$ </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">openssl</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> x509</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -in</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 1.crt</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -outform</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> der</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -out</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> cert.der</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   </span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;user-select:none;-webkit-user-select:none;">$ </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">openssl</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> rsa</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -inform</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> PEM</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -in</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 1.key</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -outform</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> DER</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -out</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> key.der</span></span></code></pre></div><h2 id="客户端证书-密钥生成" tabindex="-1">客户端证书/密钥生成 <a class="header-anchor" href="#客户端证书-密钥生成" aria-label="Permalink to “客户端证书/密钥生成”">​</a></h2><p>Windows、Linux 和 Mac OS 系统下的生成方式一致。</p><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;user-select:none;-webkit-user-select:none;">$ </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">openssl</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> req</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -config</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> localhost.cnf</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -new</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -nodes</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -x509</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -sha256</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -newkey</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> rsa:2048</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -keyout</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> localhost.key</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -days</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 365</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -subj</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;/C=DE/O=gridbeat/CN=GridBeatClient@localhost&quot;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -out</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> localhost.crt</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;user-select:none;-webkit-user-select:none;">$ </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">openssl</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> x509</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -in</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> localhost.crt</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -outform</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> der</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -out</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> client_cert.der</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">openssl</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> rsa</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -inform</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> PEM</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -in</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> localhost.key</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -outform</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> DER</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -out</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> client_key.der</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;user-select:none;-webkit-user-select:none;">$ </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">rm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> localhost.crt</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;user-select:none;-webkit-user-select:none;">$ </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">rm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> localhost.key</span></span></code></pre></div><p><code>-days</code> 可以根据需要设置数值。</p><p><code>-config</code> 指定的 *.cnf 文件可以使用下一节的文件附件 <code>localhost.cnf</code> 进行修改，需包含如下配置节：</p><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[ v3_req ]</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Extensions to add to a certificate request</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">basicConstraints</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> CA:FALSE</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">keyUsage</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> nonRepudiation,</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> digitalSignature,</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> keyEncipherment</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">subjectAltName</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> @alt_names</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[ alt_names ]</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">URI.1</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> urn:xxx.xxx.xxx</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">DNS.1</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> localhost</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">#DNS.2 = localhost</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">IP.1</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 127.0.0.1</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">#IP.2 = 0.0.0.0</span></span></code></pre></div><h2 id="文件附件-localhost-cnf" tabindex="-1">文件附件 localhost.cnf <a class="header-anchor" href="#文件附件-localhost-cnf" aria-label="Permalink to “文件附件 localhost.cnf”">​</a></h2><p>以下为 OpenSSL 配置文件示例，其中定义了用于一些用于生成证书请求、证书签发、时间戳颁发者（TSA）、证书吊销列表（CRL）等操作的参数。</p><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">#</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># OpenSSL example configuration file.</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># This is mostly being used for generation of certificate requests.</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">#</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># This definition stops the following lines choking if HOME isn&#39;t</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># defined.</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">HOME</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">			=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> .</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">RANDFILE</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">		=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> $ENV</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">::HOME/.rnd</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Extra OBJECT IDENTIFIER info:</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">#oid_file		= $ENV::HOME/.oid</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">oid_section</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">		=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> new_oids</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># To use this configuration file with the &quot;-extfile&quot; option of the</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># &quot;openssl x509&quot; utility, name here the section containing the</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># X.509v3 extensions to use:</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># extensions		= </span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># (Alternatively, use a configuration file that has only</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># X.509v3 extensions in its main [= default] section.)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[ new_oids ]</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># We can add new OIDs in here for use by &#39;ca&#39;, &#39;req&#39; and &#39;ts&#39;.</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Add a simple OID like this:</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># testoid1=1.2.3.4</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Or use config file substitution like this:</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># testoid2=\${testoid1}.5.6</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Policies used by the TSA examples.</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">tsa_policy1</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 1.2.3.4.1</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">tsa_policy2</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 1.2.3.4.5.6</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">tsa_policy3</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 1.2.3.4.5.7</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">####################################################################</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[ ca ]</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">default_ca</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">	=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> CA_default</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">		# The default ca section</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">####################################################################</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[ CA_default ]</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">dir</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">		=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ./ca/</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">			# Where everything is kept</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">certs</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">		=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> $dir</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">/certs</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">		# Where the issued certs are kept</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">crl_dir</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">		=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> $dir</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">/crl</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">		# Where the issued crl are kept</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">database</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">	=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> $dir</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">/database.txt</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">	# database index file.</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">#unique_subject	= no			# Set to &#39;no&#39; to allow creation of</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">					# several ctificates with same subject.</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">new_certs_dir</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">	=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> $dir</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">/newcerts</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">		# default place for new certs.</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">certificate</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">	=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> $dir</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">/ca.crt</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">	 	# The CA certificate</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">serial</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">		=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> $dir</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">/serial</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> 		# The current serial number</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">crlnumber</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">	=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> $dir</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">/crlnumber</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">	# the current crl number</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">					# must be commented out to leave a V1 CRL</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">crl</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">		=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> $dir</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">/crl.pem</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> 		# The current CRL</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">private_key</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">	=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> $dir</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">/ca.key</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> 		# The private key</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">RANDFILE</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">	=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> $dir</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">/.rand</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">		# private random number file</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">x509_extensions</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">	=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> usr_cert</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">		# The extensions to add to the cert</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Comment out the following two lines for the &quot;traditional&quot;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># (and highly broken) format.</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">name_opt</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 	=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ca_default</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">		# Subject Name options</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">cert_opt</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 	=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ca_default</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">		# Certificate field options</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Extension copying option: use with caution.</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># copy_extensions = copy</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Extensions to add to a CRL. Note: Netscape communicator chokes on V2 CRLs</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># so this is commented out by default to leave a V1 CRL.</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># crlnumber must also be commented out to leave a V1 CRL.</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">crl_extensions</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">	=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> crl_ext</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">default_days</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">	=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 365</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">			# how long to certify for</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">default_crl_days</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> 30</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">			# how long before next CRL</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">default_md</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">	=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> default</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">		# use public key default MD</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">preserve</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">	=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> no</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">			# keep passed DN ordering</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># A few difference way of specifying how similar the request should look</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># For type CA, the listed attributes must be the same, and the optional</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># and supplied fields are just that :-)</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">policy</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">		=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> policy_match</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># For the CA policy</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[ policy_match ]</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">countryName</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">		=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> match</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">stateOrProvinceName</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">	=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> match</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">organizationName</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">	=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> match</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">organizationalUnitName</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">	=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> optional</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">commonName</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">		=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> supplied</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">emailAddress</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">		=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> optional</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># For the &#39;anything&#39; policy</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># At this point in time, you must list all acceptable &#39;object&#39;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># types.</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[ policy_anything ]</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">countryName</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">		=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> optional</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">stateOrProvinceName</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">	=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> optional</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">localityName</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">		=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> optional</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">organizationName</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">	=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> optional</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">organizationalUnitName</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">	=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> optional</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">commonName</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">		=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> supplied</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">emailAddress</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">		=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> optional</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">####################################################################</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[ req ]</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">default_bits</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">		=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 2048</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">default_keyfile</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 	=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> privkey.pem</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">distinguished_name</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">	=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> req_distinguished_name</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">attributes</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">		=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> req_attributes</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">x509_extensions</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">	=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> v3_ca</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">	# The extensions to add to the self signed cert</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Passwords for private keys if not present they will be prompted for</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># input_password = secret</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># output_password = secret</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># This sets a mask for permitted string types. There are several options. </span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># default: PrintableString, T61String, BMPString.</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># pkix	 : PrintableString, BMPString (PKIX recommendation before 2004)</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># utf8only: only UTF8Strings (PKIX recommendation after 2004).</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># nombstr : PrintableString, T61String (no BMPStrings or UTF8Strings).</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># MASK:XXXX a literal mask value.</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># WARNING: ancient versions of Netscape crash on BMPStrings or UTF8Strings.</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">string_mask</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> utf8only</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">req_extensions</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> v3_req</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> # The extensions to add to a certificate request</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[ req_distinguished_name ]</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">countryName</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">			=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> Country</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> Name</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (2 </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">letter</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> code</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">countryName_default</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">		=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> AU</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">countryName_min</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">			=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 2</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">countryName_max</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">			=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 2</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">stateOrProvinceName</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">		=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> State</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> or</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> Province</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> Name</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (full </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">name</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">stateOrProvinceName_default</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">	=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> Some-State</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">localityName</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">			=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> Locality</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> Name</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (eg, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">city</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">0.organizationName</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">		=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> Organization</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> Name</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (eg, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">company</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">0.organizationName_default</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">	=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> Internet</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> Widgits</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> Pty</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> Ltd</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># we can do this but it is not needed normally :-)</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">#1.organizationName		= Second Organization Name (eg, company)</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">#1.organizationName_default	= World Wide Web Pty Ltd</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">organizationalUnitName</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">		=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> Organizational</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> Unit</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> Name</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (eg, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">section</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">#organizationalUnitName_default	=</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">commonName</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">			=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> Common</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> Name</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (e.g. </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">server</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> FQDN</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> or</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> YOUR</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> name</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">commonName_max</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">			=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 64</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">emailAddress</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">			=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> Email</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> Address</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">emailAddress_max</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">		=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 64</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># SET-ex3			= SET extension number 3</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[ req_attributes ]</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">challengePassword</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">		=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> A</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> challenge</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> password</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">challengePassword_min</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">		=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 4</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">challengePassword_max</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">		=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 20</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">unstructuredName</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">		=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> An</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> optional</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> company</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> name</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[ usr_cert ]</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># These extensions are added when &#39;ca&#39; signs a request.</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># This goes against PKIX guidelines but some CAs do it and some software</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># requires this to avoid interpreting an end user certificate as a CA.</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">basicConstraints</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">CA:FALSE</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Here are some examples of the usage of nsCertType. If it is omitted</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># the certificate can be used for anything *except* object signing.</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># This is OK for an SSL server.</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># nsCertType			= server</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># For an object signing certificate this would be used.</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># nsCertType = objsign</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># For normal client use this is typical</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># nsCertType = client, email</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># and for everything including object signing:</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># nsCertType = client, email, objsign</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># This is typical in keyUsage for a client certificate.</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># keyUsage = nonRepudiation, digitalSignature, keyEncipherment</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># This will be displayed in Netscape&#39;s comment listbox.</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">nsComment</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">			=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;OpenSSL Generated Certificate&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># PKIX recommendations harmless if included in all certificates.</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">subjectKeyIdentifier</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">hash</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">authorityKeyIdentifier</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">keyid,issuer</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># This stuff is for subjectAltName and issuerAltname.</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Import the email address.</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># subjectAltName=email:copy</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># An alternative to produce certificates that aren&#39;t</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># deprecated according to PKIX.</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># subjectAltName=email:move</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Copy subject details</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># issuerAltName=issuer:copy</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">#nsCaRevocationUrl		= http://www.domain.dom/ca-crl.pem</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">#nsBaseUrl</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">#nsRevocationUrl</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">#nsRenewalUrl</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">#nsCaPolicyUrl</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">#nsSslServerName</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># This is required for TSA certificates.</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">extendedKeyUsage</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> critical,timeStamping</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[ v3_req ]</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Extensions to add to a certificate request</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">basicConstraints</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> CA:FALSE</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">keyUsage</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> nonRepudiation,</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> digitalSignature,</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> keyEncipherment</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">subjectAltName</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> @alt_names</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[ alt_names ]</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">URI.1</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> urn:gridbeat.client.application</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">DNS.1</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> localhost</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">#DNS.2 = localhost</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">IP.1</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 127.0.0.1</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">#IP.2 = 0.0.0.0</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[ v3_ca ]</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Extensions for a typical CA</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># PKIX recommendation.</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">subjectKeyIdentifier</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">hash</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">authorityKeyIdentifier</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">keyid:always,issuer</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># This is what PKIX recommends but some broken software chokes on critical</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># extensions.</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">#basicConstraints = critical,CA:true</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># So we do this instead.</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">basicConstraints</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> CA:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">false</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Key usage: this is typical for a CA certificate. However since it will</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># prevent it being used as an test self-signed certificate it is best</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># left out by default.</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># keyUsage = cRLSign, keyCertSign</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">keyUsage</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> nonRepudiation,</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> digitalSignature,</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> keyEncipherment,</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> dataEncipherment,</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> keyCertSign</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">extendedKeyUsage</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> TLS</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> Web</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> Server</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> Authentication,</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> TLS</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> Web</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> Client</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> Authentication</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Some might want this also</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># nsCertType = sslCA, emailCA</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Include email address in subject alt name: another PKIX recommendation</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># subjectAltName=email:copy</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Copy issuer details</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># issuerAltName=issuer:copy</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># DER hex encoding of an extension: beware experts only!</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># obj=DER:02:03</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Where &#39;obj&#39; is a standard or added object</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># You can even override a supported extension:</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># basicConstraints= critical, DER:30:03:01:01:FF</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">subjectAltName</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">         =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> @alt_names</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[ crl_ext ]</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># CRL extensions.</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Only issuerAltName and authorityKeyIdentifier make any sense in a CRL.</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># issuerAltName=issuer:copy</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">authorityKeyIdentifier</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">keyid:always</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[ proxy_cert_ext ]</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># These extensions should be added when creating a proxy certificate</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># This goes against PKIX guidelines but some CAs do it and some software</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># requires this to avoid interpreting an end user certificate as a CA.</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">basicConstraints</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">CA:FALSE</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Here are some examples of the usage of nsCertType. If it is omitted</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># the certificate can be used for anything *except* object signing.</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># This is OK for an SSL server.</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># nsCertType			= server</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># For an object signing certificate this would be used.</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># nsCertType = objsign</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># For normal client use this is typical</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># nsCertType = client, email</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># and for everything including object signing:</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># nsCertType = client, email, objsign</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># This is typical in keyUsage for a client certificate.</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># keyUsage = nonRepudiation, digitalSignature, keyEncipherment</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># This will be displayed in Netscape&#39;s comment listbox.</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">nsComment</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">			=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;OpenSSL Generated Certificate&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># PKIX recommendations harmless if included in all certificates.</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">subjectKeyIdentifier</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">hash</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">authorityKeyIdentifier</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">keyid,issuer</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># This stuff is for subjectAltName and issuerAltname.</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Import the email address.</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># subjectAltName=email:copy</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># An alternative to produce certificates that aren&#39;t</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># deprecated according to PKIX.</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># subjectAltName=email:move</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Copy subject details</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># issuerAltName=issuer:copy</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">#nsCaRevocationUrl		= http://www.domain.dom/ca-crl.pem</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">#nsBaseUrl</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">#nsRevocationUrl</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">#nsRenewalUrl</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">#nsCaPolicyUrl</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">#nsSslServerName</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># This really needs to be in place for it to be a proxy certificate.</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">proxyCertInfo</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">critical,language:id-ppl-anyLanguage,pathlen:3,policy:foo</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">####################################################################</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[ tsa ]</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">default_tsa</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> tsa_config1</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">	# the default TSA section</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[ tsa_config1 ]</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># These are used by the TSA reply generation only.</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">dir</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">		=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ./demoCA</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">		# TSA root directory</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">serial</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">		=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> $dir</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">/tsaserial</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">	# The current serial number (mandatory)</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">crypto_device</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">	=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> builtin</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">		# OpenSSL engine to use for signing</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">signer_cert</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">	=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> $dir</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">/tsacert.pem</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> 	# The TSA signing certificate</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">					# (optional)</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">certs</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">		=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> $dir</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">/cacert.pem</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">	# Certificate chain to include in reply</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">					# (optional)</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">signer_key</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">	=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> $dir</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">/private/tsakey.pem</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> # The TSA private key (optional)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">default_policy</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">	=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> tsa_policy1</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">		# Policy if request did not specify it</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">					# (optional)</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">other_policies</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">	=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> tsa_policy2,</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> tsa_policy3</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">	# acceptable policies (optional)</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">digests</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">		=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> md5,</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> sha1</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">		# Acceptable message digests (mandatory)</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">accuracy</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">	=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> secs:1,</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> millisecs:500,</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> microsecs:100</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">	# (optional)</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">clock_precision_digits</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 0</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">	# number of digits after dot. (optional)</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">ordering</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">		=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> yes</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">	# Is ordering defined for timestamps?</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">				# (optional, default: no)</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">tsa_name</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">		=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> yes</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">	# Must the TSA name be included in the reply?</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">				# (optional, default: no)</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">ess_cert_id_chain</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">	=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> no</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">	# Must the ESS cert id chain be included?</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">				# (optional, default: no)</span></span></code></pre></div>`,20)])])}const y=i(t,[["render",p]]);export{g as __pageData,y as default};
