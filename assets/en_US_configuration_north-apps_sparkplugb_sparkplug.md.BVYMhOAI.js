import{_ as n,c as s,o as p,ah as e,cu as t,cv as l,cw as i,cx as o,cy as r,cz as c,cA as d,cB as u,cC as h,cD as g,cE as m,cF as f,cG as b,cH as _,cI as y,cJ as v,cK as x}from"./chunks/framework.DGOuNAW6.js";const D=JSON.parse('{"title":"Integrate with EMQX","description":"","frontmatter":{},"headers":[],"relativePath":"en_US/configuration/north-apps/sparkplugb/sparkplug.md","filePath":"en_US/configuration/north-apps/sparkplugb/sparkplug.md"}'),k={name:"en_US/configuration/north-apps/sparkplugb/sparkplug.md"};function T(S,a,P,w,M,B){return p(),s("div",null,[...a[0]||(a[0]=[e('<h1 id="integrate-with-emqx" tabindex="-1">Integrate with EMQX <a class="header-anchor" href="#integrate-with-emqx" aria-label="Permalink to “Integrate with EMQX”">​</a></h1><p>This page introduces how to use the GridBeat southbound driver to collect data, then report the data to EMQX through the northbound Sparkplug B plug-in, and the correct and complete data results are obtained after decoding through the codec function. The process is shown in the figure:</p><p><img src="'+t+'" alt="Sparkplug B"></p><h2 id="configure-gridbeat" tabindex="-1">Configure GridBeat <a class="header-anchor" href="#configure-gridbeat" aria-label="Permalink to “Configure GridBeat”">​</a></h2><h3 id="southbound-device" tabindex="-1">Southbound Device <a class="header-anchor" href="#southbound-device" aria-label="Permalink to “Southbound Device”">​</a></h3><p>Collect the Modbus TCP simulator point value through the southbound drive to simulate the actual device point value, the configuration is as follows：</p><p><strong>Add device</strong></p><p><img src="'+l+'" alt="image-20230421141232191"></p><p><strong>Device Configuration</strong></p><p><img src="'+i+'" alt="image-20230421141356669"></p><p><img src="'+o+'" alt="image-20230421141441471"></p><p><strong>Create group</strong></p><p><img src="'+r+'" alt="image-20230421141538315"></p><p><strong>Create Tag</strong></p><p><img src="'+c+'" alt="image-20230421141639201"></p><h3 id="northbound-application" tabindex="-1">Northbound application <a class="header-anchor" href="#northbound-application" aria-label="Permalink to “Northbound application”">​</a></h3><p><strong>Add application</strong></p><p><img src="'+d+'" alt="image-20230421141821812"></p><p><strong>Application configuration</strong></p><p><img src="'+u+'" alt="image-20230421141912355"></p><p><img src="'+h+'" alt="image-20230421142020855"></p><p><strong>Add subscription</strong></p><p><img src="'+g+'" alt="image-20230421142109283"></p><h2 id="configure-emqx" tabindex="-1">Configure EMQX <a class="header-anchor" href="#configure-emqx" aria-label="Permalink to “Configure EMQX”">​</a></h2><p>You can use <a href="https://mqttx.app/" target="_blank" rel="noreferrer">MQTTX</a> to view the forwarded messages to EMQX from GridBeat. However, if you directly subscribe to the EMQX data reported by GridBeat northbound to SparkPlugB, there will be garbled strings, as shown in the figure:</p><p><img src="'+m+'" alt="image-20230421151918685"></p><p>Therefore, through the encoding and decoding capabilities of the EMQX rule engine, a corresponding proto file can be written and combined with the rule engine to decode the reported data and obtain correct and complete data results.</p><h3 id="create-schema-registry" tabindex="-1">Create Schema Registry <a class="header-anchor" href="#create-schema-registry" aria-label="Permalink to “Create Schema Registry”">​</a></h3><p><img src="'+f+'" alt="image-20230421142801332"></p><p><img src="'+b+`" alt="image-20230421142920299"></p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>// Complete proto file</span></span>
<span class="line"><span>syntax = &quot;proto2&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//</span></span>
<span class="line"><span>// To compile:</span></span>
<span class="line"><span>// cd client_libraries/java</span></span>
<span class="line"><span>// protoc --proto_path=../../ --java_out=src/main/java ../../sparkplug_b.proto </span></span>
<span class="line"><span>//</span></span>
<span class="line"><span></span></span>
<span class="line"><span>message Payload {</span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>        // Indexes of Data Types</span></span>
<span class="line"><span>        // Unknown placeholder for future expansion.</span></span>
<span class="line"><span>        Unknown         = 0;</span></span>
<span class="line"><span>        // Basic Types</span></span>
<span class="line"><span>        Int8            = 1;</span></span>
<span class="line"><span>        Int16           = 2;</span></span>
<span class="line"><span>        Int32           = 3;</span></span>
<span class="line"><span>        Int64           = 4;</span></span>
<span class="line"><span>        UInt8           = 5;</span></span>
<span class="line"><span>        UInt16          = 6;</span></span>
<span class="line"><span>        UInt32          = 7;</span></span>
<span class="line"><span>        UInt64          = 8;</span></span>
<span class="line"><span>        Float           = 9;</span></span>
<span class="line"><span>        Double          = 10;</span></span>
<span class="line"><span>        Boolean         = 11;</span></span>
<span class="line"><span>        String          = 12;</span></span>
<span class="line"><span>        DateTime        = 13;</span></span>
<span class="line"><span>        Text            = 14;</span></span>
<span class="line"><span>        // Additional Metric Types</span></span>
<span class="line"><span>        UUID            = 15;</span></span>
<span class="line"><span>        DataSet         = 16;</span></span>
<span class="line"><span>        Bytes           = 17;</span></span>
<span class="line"><span>        File            = 18;</span></span>
<span class="line"><span>        Template        = 19;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        // Additional PropertyValue Types</span></span>
<span class="line"><span>        PropertySet     = 20;</span></span>
<span class="line"><span>        PropertySetList = 21;</span></span>
<span class="line"><span>    */</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    message Template {</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        message Parameter {</span></span>
<span class="line"><span>            optional string name        = 1;</span></span>
<span class="line"><span>            optional uint32 type        = 2;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            oneof value {</span></span>
<span class="line"><span>                uint32 int_value        = 3;</span></span>
<span class="line"><span>                uint64 long_value       = 4;</span></span>
<span class="line"><span>                float  float_value      = 5;</span></span>
<span class="line"><span>                double double_value     = 6;</span></span>
<span class="line"><span>                bool   boolean_value    = 7;</span></span>
<span class="line"><span>                string string_value     = 8;</span></span>
<span class="line"><span>                ParameterValueExtension extension_value = 9;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            message ParameterValueExtension {</span></span>
<span class="line"><span>                extensions              1 to max;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        optional string version         = 1;          // The version of the Template to prevent mismatches</span></span>
<span class="line"><span>        repeated Metric metrics         = 2;          // Each metric is the name of the metric and the datatype of the member but does not contain a value</span></span>
<span class="line"><span>        repeated Parameter parameters   = 3;</span></span>
<span class="line"><span>        optional string template_ref    = 4;          // Reference to a template if this is extending a Template or an instance - must exist if an instance</span></span>
<span class="line"><span>        optional bool is_definition     = 5;</span></span>
<span class="line"><span>        extensions                      6 to max;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    message DataSet {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        message DataSetValue {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            oneof value {</span></span>
<span class="line"><span>                uint32 int_value                        = 1;</span></span>
<span class="line"><span>                uint64 long_value                       = 2;</span></span>
<span class="line"><span>                float  float_value                      = 3;</span></span>
<span class="line"><span>                double double_value                     = 4;</span></span>
<span class="line"><span>                bool   boolean_value                    = 5;</span></span>
<span class="line"><span>                string string_value                     = 6;</span></span>
<span class="line"><span>                DataSetValueExtension extension_value   = 7;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            message DataSetValueExtension {</span></span>
<span class="line"><span>                extensions  1 to max;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        message Row {</span></span>
<span class="line"><span>            repeated DataSetValue elements  = 1;</span></span>
<span class="line"><span>            extensions                      2 to max;   // For third party extensions</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        optional uint64   num_of_columns    = 1;</span></span>
<span class="line"><span>        repeated string   columns           = 2;</span></span>
<span class="line"><span>        repeated uint32   types             = 3;</span></span>
<span class="line"><span>        repeated Row      rows              = 4;</span></span>
<span class="line"><span>        extensions                          5 to max;   // For third party extensions</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    message PropertyValue {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        optional uint32     type                    = 1;</span></span>
<span class="line"><span>        optional bool       is_null                 = 2; </span></span>
<span class="line"><span></span></span>
<span class="line"><span>        oneof value {</span></span>
<span class="line"><span>            uint32          int_value               = 3;</span></span>
<span class="line"><span>            uint64          long_value              = 4;</span></span>
<span class="line"><span>            float           float_value             = 5;</span></span>
<span class="line"><span>            double          double_value            = 6;</span></span>
<span class="line"><span>            bool            boolean_value           = 7;</span></span>
<span class="line"><span>            string          string_value            = 8;</span></span>
<span class="line"><span>            PropertySet     propertyset_value       = 9;</span></span>
<span class="line"><span>            PropertySetList propertysets_value      = 10;      // List of Property Values</span></span>
<span class="line"><span>            PropertyValueExtension extension_value  = 11;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        message PropertyValueExtension {</span></span>
<span class="line"><span>            extensions                             1 to max;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    message PropertySet {</span></span>
<span class="line"><span>        repeated string        keys     = 1;         // Names of the properties</span></span>
<span class="line"><span>        repeated PropertyValue values   = 2;</span></span>
<span class="line"><span>        extensions                      3 to max;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    message PropertySetList {</span></span>
<span class="line"><span>        repeated PropertySet propertyset = 1;</span></span>
<span class="line"><span>        extensions                       2 to max;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    message MetaData {</span></span>
<span class="line"><span>        // Bytes specific metadata</span></span>
<span class="line"><span>        optional bool   is_multi_part   = 1;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // General metadata</span></span>
<span class="line"><span>        optional string content_type    = 2;        // Content/Media type</span></span>
<span class="line"><span>        optional uint64 size            = 3;        // File size, String size, Multi-part size, etc</span></span>
<span class="line"><span>        optional uint64 seq             = 4;        // Sequence number for multi-part messages</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // File metadata</span></span>
<span class="line"><span>        optional string file_name       = 5;        // File name</span></span>
<span class="line"><span>        optional string file_type       = 6;        // File type (i.e. xml, json, txt, cpp, etc)</span></span>
<span class="line"><span>        optional string md5             = 7;        // md5 of data</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // Catchalls and future expansion</span></span>
<span class="line"><span>        optional string description     = 8;        // Could be anything such as json or xml of custom properties</span></span>
<span class="line"><span>        extensions                      9 to max;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    message Metric {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        optional string   name          = 1;        // Metric name - should only be included on birth</span></span>
<span class="line"><span>        optional uint64   alias         = 2;        // Metric alias - tied to name on birth and included in all later DATA messages</span></span>
<span class="line"><span>        optional uint64   timestamp     = 3;        // Timestamp associated with data acquisition time</span></span>
<span class="line"><span>        optional uint32   datatype      = 4;        // DataType of the metric/tag value</span></span>
<span class="line"><span>        optional bool     is_historical = 5;        // If this is historical data and should not update real time tag</span></span>
<span class="line"><span>        optional bool     is_transient  = 6;        // Tells consuming clients such as MQTT Engine to not store this as a tag</span></span>
<span class="line"><span>        optional bool     is_null       = 7;        // If this is null - explicitly say so rather than using -1, false, etc for some datatypes.</span></span>
<span class="line"><span>        optional MetaData metadata      = 8;        // Metadata for the payload</span></span>
<span class="line"><span>        optional PropertySet properties = 9;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        oneof value {</span></span>
<span class="line"><span>            uint32   int_value                      = 10;</span></span>
<span class="line"><span>            uint64   long_value                     = 11;</span></span>
<span class="line"><span>            float    float_value                    = 12;</span></span>
<span class="line"><span>            double   double_value                   = 13;</span></span>
<span class="line"><span>            bool     boolean_value                  = 14;</span></span>
<span class="line"><span>            string   string_value                   = 15;</span></span>
<span class="line"><span>            bytes    bytes_value                    = 16;       // Bytes, File</span></span>
<span class="line"><span>            DataSet  dataset_value                  = 17;</span></span>
<span class="line"><span>            Template template_value                 = 18;</span></span>
<span class="line"><span>            MetricValueExtension extension_value    = 19;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        message MetricValueExtension {</span></span>
<span class="line"><span>            extensions  1 to max;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    optional uint64   timestamp     = 1;        // Timestamp at message sending time</span></span>
<span class="line"><span>    repeated Metric   metrics       = 2;        // Repeated forever - no limit in Google Protobufs</span></span>
<span class="line"><span>    optional uint64   seq           = 3;        // Sequence number</span></span>
<span class="line"><span>    optional string   uuid          = 4;        // UUID to track message type in terms of schema definitions</span></span>
<span class="line"><span>    optional bytes    body          = 5;        // To optionally bypass the whole definition above</span></span>
<span class="line"><span>    extensions                      6 to max;   // For third party extensions</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="create-rule" tabindex="-1">Create Rule <a class="header-anchor" href="#create-rule" aria-label="Permalink to “Create Rule”">​</a></h3><p><strong>SQL statement</strong></p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>SELECT</span></span>
<span class="line"><span>  schema_decode(&#39;gridbeat&#39;, payload, &#39;Payload&#39;) as SparkPlugB</span></span>
<span class="line"><span>FROM</span></span>
<span class="line"><span>  &quot;spBv1.0/group1/DDATA/node1/modbus&quot;</span></span></code></pre></div><p>The key point here is <code>schema_decode(&#39;gridbeat&#39;, payload, &#39;Payload&#39;)</code>:</p><ul><li><code>schema_decode</code> The function decodes the content of the payload field according to the Schema &#39;protobuf_person&#39;;</li><li><code>as SparkPlugB</code> Store the decoded value in the variable &quot;SparkPlugB&quot;;</li><li>The last parameter <code>Payload</code> indicates that the message type in the payload is the &#39;Payload&#39; type defined in the protobuf schema.</li></ul><p><img src="`+_+'" alt="image-20230421143952695"></p><p><strong>Then add the action with the following parameters:</strong></p><ul><li>Action Type: Message republish</li><li>Purpose topic: SparkPlugB/test</li></ul><p>This action sends the decoded &quot;Payload&quot; to the <code>SparkPlugB/test</code> topic in JSON format.</p><p><img src="'+y+'" alt="image-20230421143453011"></p><h2 id="verify-with-mqttx" tabindex="-1">Verify with MQTTX <a class="header-anchor" href="#verify-with-mqttx" aria-label="Permalink to “Verify with MQTTX”">​</a></h2><p>Here, the MQTTX tool is used to subscribe to the data decoded by the codec function of the EMQX rule engine, as shown in the figure:</p><p><img src="'+v+'" alt="image-20230421151817047"></p><p>As shown in the figure above, it can be seen that the original data before decoding is garbled, and the complete and correct data result is obtained after decoding; so far, the point value of the device is collected in the south direction of GridBeat, and reported to EMQX in the north direction of SparkPlugB, and the complete data is obtained by decoding through the codec function Data results are complete.</p><h2 id="further-reading" tabindex="-1">Further Reading <a class="header-anchor" href="#further-reading" aria-label="Permalink to “Further Reading”">​</a></h2><p>The topic that GridBeat reports data to EMQX is <code>namespace/group_id/DDATA/edge_node_id/device_id</code> defined according to the Sparkplug B protocol specification, as shown in the figure:</p><p><img src="'+x+'" alt="image-20230419143059088"></p><p>As for how to define more GridBeat northbound Sparkplug B plug-in related standards, you can refer to the Sparkplug B protocol specification<a href="https://www.eclipse.org/tahu/spec/Sparkplug%20Topic%20Namespace%20and%20State%20ManagementV2.2-with%20appendix%20B%20format%20-%20Eclipse.pdf" target="_blank" rel="noreferrer">🔗</a></p>',49)])])}const C=n(k,[["render",T]]);export{D as __pageData,C as default};
