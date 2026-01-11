import{_ as n,c as a,o as e,ah as t}from"./chunks/framework.DGOuNAW6.js";const u=JSON.parse('{"title":"统计信息","description":"","frontmatter":{},"headers":[],"relativePath":"zh_CN/api/metrics.md","filePath":"zh_CN/api/metrics.md"}'),p={name:"zh_CN/api/metrics.md"};function o(l,s,r,i,c,d){return e(),a("div",null,[...s[0]||(s[0]=[t(`<h1 id="统计信息" tabindex="-1">统计信息 <a class="header-anchor" href="#统计信息" aria-label="Permalink to “统计信息”">​</a></h1><p>这个 API 由 <a href="./../configuration/north-apps/monitor/overview.html">Monitor 插件</a>实现，提供兼容 <a href="https://prometheus.io/" target="_blank" rel="noreferrer">Prometheus</a> 的统计数据。</p><h2 id="获取统计信息" tabindex="-1">获取统计信息 <a class="header-anchor" href="#获取统计信息" aria-label="Permalink to “获取统计信息”">​</a></h2><p><em>GET</em> /api/v2/metrics</p><h3 id="请求头部" tabindex="-1">请求头部 <a class="header-anchor" href="#请求头部" aria-label="Permalink to “请求头部”">​</a></h3><p><strong>Authorization</strong> Bearer &lt;token&gt;</p><h3 id="请求参数" tabindex="-1">请求参数 <a class="header-anchor" href="#请求参数" aria-label="Permalink to “请求参数”">​</a></h3><p><strong>category</strong> 可选, 取值为 <code>global</code>, <code>driver</code> 或 <code>app</code> 之一</p><p><strong>node</strong> 可选, 用节点名过滤, 且必须指定 <code>category=driver</code> 或 <code>category=app</code></p><h3 id="响应状态" tabindex="-1">响应状态 <a class="header-anchor" href="#响应状态" aria-label="Permalink to “响应状态”">​</a></h3><ul><li>200 OK</li><li>400 请求错误</li><li>500 服务器内部错误</li></ul><h3 id="响应" tabindex="-1">响应 <a class="header-anchor" href="#响应" aria-label="Permalink to “响应”">​</a></h3><div class="language-text"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span># HELP core_dumped Whether there is any core dump</span></span>
<span class="line"><span># TYPE core_dumped gauge</span></span>
<span class="line"><span>core_dumped 0</span></span>
<span class="line"><span># HELP uptime_seconds Uptime in seconds</span></span>
<span class="line"><span># TYPE uptime_seconds counter</span></span>
<span class="line"><span>uptime_seconds 314</span></span>
<span class="line"><span># HELP north_nodes_total Number of north nodes</span></span>
<span class="line"><span># TYPE north_nodes_total gauge</span></span>
<span class="line"><span>north_nodes_total 1</span></span>
<span class="line"><span># HELP north_running_nodes_total Number of north nodes in running state</span></span>
<span class="line"><span># TYPE north_running_nodes_total gauge</span></span>
<span class="line"><span>north_running_nodes_total 1</span></span>
<span class="line"><span># HELP north_disconnected_nodes_total Number of north nodes disconnected</span></span>
<span class="line"><span># TYPE north_disconnected_nodes_total gauge</span></span>
<span class="line"><span>north_disconnected_nodes_total 1</span></span>
<span class="line"><span># HELP south_nodes_total Number of south nodes</span></span>
<span class="line"><span># TYPE south_nodes_total gauge</span></span>
<span class="line"><span>south_nodes_total 1</span></span>
<span class="line"><span># HELP south_running_nodes_total Number of south nodes in running state</span></span>
<span class="line"><span># TYPE south_running_nodes_total gauge</span></span>
<span class="line"><span>south_running_nodes_total 0</span></span>
<span class="line"><span># HELP south_disconnected_nodes_total Number of south nodes disconnected</span></span>
<span class="line"><span># TYPE south_disconnected_nodes_total gauge</span></span>
<span class="line"><span>south_disconnected_nodes_total 1</span></span>
<span class="line"><span># HELP send_msgs_total Total number of messages sent</span></span>
<span class="line"><span># TYPE send_msgs_total counter</span></span>
<span class="line"><span>send_msgs_total{node=&quot;data-stream-processing&quot;} 0</span></span>
<span class="line"><span># HELP send_msg_errors_total Total number of errors sending messages</span></span>
<span class="line"><span># TYPE send_msg_errors_total counter</span></span>
<span class="line"><span>send_msg_errors_total{node=&quot;data-stream-processing&quot;} 0</span></span>
<span class="line"><span># HELP recv_msgs_total Total number of messages received</span></span>
<span class="line"><span># TYPE recv_msgs_total counter</span></span>
<span class="line"><span>recv_msgs_total{node=&quot;data-stream-processing&quot;} 0</span></span>
<span class="line"><span># HELP last_rtt_ms Last request round trip time in milliseconds</span></span>
<span class="line"><span># TYPE last_rtt_ms gauge</span></span>
<span class="line"><span>last_rtt_ms{node=&quot;modbus&quot;} 9999</span></span>
<span class="line"><span># HELP send_bytes Total number of bytes sent</span></span>
<span class="line"><span># TYPE send_bytes gauge</span></span>
<span class="line"><span>send_bytes{node=&quot;modbus&quot;} 0</span></span>
<span class="line"><span># HELP recv_bytes Total number of bytes received</span></span>
<span class="line"><span># TYPE recv_bytes gauge</span></span>
<span class="line"><span>recv_bytes{node=&quot;modbus&quot;} 0</span></span>
<span class="line"><span># HELP tag_reads_total Total number of tag reads including errors</span></span>
<span class="line"><span># TYPE tag_reads_total counter</span></span>
<span class="line"><span>tag_reads_total{node=&quot;modbus&quot;} 0</span></span>
<span class="line"><span># HELP tag_read_errors_total Total number of tag read errors</span></span>
<span class="line"><span># TYPE tag_read_errors_total counter</span></span>
<span class="line"><span>tag_read_errors_total{node=&quot;modbus&quot;} 0</span></span>
<span class="line"><span># HELP group_tags_total Total number of tags in the group</span></span>
<span class="line"><span># TYPE group_tags_total gauge</span></span>
<span class="line"><span>group_tags_total{node=&quot;modbus&quot;,group=&quot;grp&quot;} 1</span></span>
<span class="line"><span># HELP group_last_send_msgs Number of messages sent on last group timer invocation</span></span>
<span class="line"><span># TYPE group_last_send_msgs gauge</span></span>
<span class="line"><span>group_last_send_msgs{node=&quot;modbus&quot;,group=&quot;grp&quot;} 0</span></span>
<span class="line"><span># HELP group_last_timer_ms Time in milliseconds consumed on last group timer invocation</span></span>
<span class="line"><span># TYPE group_last_timer_ms gauge</span></span>
<span class="line"><span>group_last_timer_ms{node=&quot;modbus&quot;,group=&quot;grp&quot;} 0</span></span></code></pre></div>`,13)])])}const g=n(p,[["render",o]]);export{u as __pageData,g as default};
