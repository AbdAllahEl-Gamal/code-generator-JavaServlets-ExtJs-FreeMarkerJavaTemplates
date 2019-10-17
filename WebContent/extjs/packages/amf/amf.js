Ext.define('Ext.data.amf.Encoder',{alias:'data.amf.Encoder',config:{format:3},bytes:[],constructor:function(a){this.initConfig(a);this.clear()},clear:function(){this.bytes=[]},applyFormat:function(a){var b={0:{writeUndefined:this.write0Undefined,writeNull:this.write0Null,writeBoolean:this.write0Boolean,writeNumber:this.write0Number,writeString:this.write0String,writeXml:this.write0Xml,writeDate:this.write0Date,writeArray:this.write0Array,writeGenericObject:this.write0GenericObject},3:{writeUndefined:this.write3Undefined,writeNull:this.write3Null,writeBoolean:this.write3Boolean,writeNumber:this.write3Number,writeString:this.write3String,writeXml:this.write3Xml,writeDate:this.write3Date,writeArray:this.write3Array,writeGenericObject:this.write3GenericObject}}[a];if(b){Ext.apply(this,b);return a}else {return}},writeObject:function(a){var b=typeof (a);if(b==="undefined"){this.writeUndefined()}else if(a===null){this.writeNull()}else if(Ext.isBoolean(a)){this.writeBoolean(a)}else if(Ext.isString(a)){this.writeString(a)}else if(b==="number"||a instanceof Number){this.writeNumber(a)}else if(b==="object"){if(a instanceof Date){this.writeDate(a)}else if(Ext.isArray(a)){this.writeArray(a)}else if(this.isXmlDocument(a)){this.writeXml(a)}else {this.writeGenericObject(a)}}else {}},write3Undefined:function(){this.writeByte(0)},write0Undefined:function(){this.writeByte(6)},write3Null:function(){this.writeByte(1)},write0Null:function(){this.writeByte(5)},write3Boolean:function(a){if(a){this.writeByte(3)}else {this.writeByte(2)}},write0Boolean:function(a){this.writeByte(1);if(a){this.writeByte(1)}else {this.writeByte(0)}},encode29Int:function(e){var b=[],a=e,d,c;if(a==0){return [0]}if(a>2097151){d=a&255;b.unshift(d);a=a>>8}while(a>0){d=a&127;b.unshift(d);a=a>>7}for(c=0;c<b.length-1;c++){b[c]=b[c]|128}return b},write3Number:function(a){var b;var c=536870911,d=-268435455;if(a instanceof Number){a=a.valueOf()}if(a%1===0&&a>=d&&a<=c){a=a&c;b=this.encode29Int(a);b.unshift(4);this.writeBytes(b)}else {b=this.encodeDouble(a);b.unshift(5);this.writeBytes(b)}},write0Number:function(a){var b;if(a instanceof Number){a=a.valueOf()}b=this.encodeDouble(a);b.unshift(0);this.writeBytes(b)},encodeUtf8Char:function(a){var c=[],d,e,f,b;if(a<=127){c.push(a)}else {if(a<=2047){e=2}else if(a<=65535){e=3}else {e=4}b=128;for(f=1;f<e;f++){d=(a&63)|128;c.unshift(d);a=a>>6;b=(b>>1)|128}d=a|b;c.unshift(d)}return c},encodeUtf8String:function(c){var a,b=[];for(a=0;a<c.length;a++){var d=this.encodeUtf8Char(c.charCodeAt(a));Ext.Array.push(b,d)}return b},encode3Utf8StringLen:function(c){var a=c.length,b=[];if(a<=268435455){a=a<<1;a=a|1;b=this.encode29Int(a)}else {}return b},write3String:function(b){if(b==""){this.writeByte(6);this.writeByte(1)}else {var a=this.encodeUtf8String(b);var c=this.encode3Utf8StringLen(a);this.writeByte(6);this.writeBytes(c);this.writeBytes(a)}},encodeXInt:function(a,d){var c=[],b;for(b=0;b<d;b++){c.unshift(a&255);a=a>>8}return c},write0String:function(d){if(d==""){this.writeByte(2);this.writeBytes([0,0])}else {var a=this.encodeUtf8String(d);var b;var c;if(a.length<=65535){b=2;c=this.encodeXInt(a.length,2)}else {b=12;c=this.encodeXInt(a.length,4)}this.writeByte(b);this.writeBytes(c);this.writeBytes(a)}},write3XmlWithType:function(e,b){var c=this.convertXmlToString(e);if(c==""){this.writeByte(b);this.writeByte(1)}else {var a=this.encodeUtf8String(c);var d=this.encode3Utf8StringLen(a);this.writeByte(b);this.writeBytes(d);this.writeBytes(a)}},write3XmlDocument:function(a){this.write3XmlWithType(a,7)},write3Xml:function(a){this.write3XmlWithType(a,11)},write0Xml:function(d){var c=this.convertXmlToString(d);this.writeByte(15);var a=this.encodeUtf8String(c);var b=this.encodeXInt(a.length,4);this.writeBytes(b);this.writeBytes(a)},write3Date:function(a){this.writeByte(8);this.writeBytes(this.encode29Int(1));this.writeBytes(this.encodeDouble(new Number(a)))},write0Date:function(a){this.writeByte(11);this.writeBytes(this.encodeDouble(new Number(a)));this.writeBytes([0,0])},write3Array:function(b){this.writeByte(9);var a=b.length;a=a<<1;a=a|1;this.writeBytes(this.encode29Int(a));this.writeByte(1);Ext.each(b,function(a){this.writeObject(a)},this)},write0ObjectProperty:function(a,d){if(!(a instanceof String)&&(typeof (a)!=="string")){a=a+""}var b=this.encodeUtf8String(a);var c;c=this.encodeXInt(b.length,2);this.writeBytes(c);this.writeBytes(b);this.writeObject(d)},write0Array:function(b){var a;this.writeByte(8);var c=0;for(a in b){c++}this.writeBytes(this.encodeXInt(c,4));for(a in b){Ext.Array.push(this.write0ObjectProperty(a,b[a]))}this.writeBytes([0,0,9])},write0StrictArray:function(a){this.writeByte(10);var b=a.length;this.writeBytes(this.encodeXInt(b,4));Ext.each(a,function(b){this.writeObject(b)},this)},write3ByteArray:function(b){this.writeByte(12);var a=b.length;a=a<<1;a=a|1;this.writeBytes(this.encode29Int(a));this.writeBytes(b)},write3GenericObject:function(b){var a;this.writeByte(10);var e=11;this.writeByte(e);this.writeByte(1);for(a in b){var d=new String(a).valueOf();if(d==""){}var c=(this.encodeUtf8String(a));this.writeBytes(this.encode3Utf8StringLen(a));this.writeBytes(c);this.writeObject(b[a])}this.writeByte(1)},write0GenericObject:function(b){var c,d,a;c=!!b.$flexType;d=c?16:3;this.writeByte(d);if(c){this.write0ShortUtf8String(b.$flexType)}for(a in b){if(a!="$flexType"){Ext.Array.push(this.write0ObjectProperty(a,b[a]))}}this.writeBytes([0,0,9])},writeByte:function(a){Ext.Array.push(this.bytes,a)},writeBytes:function(a){var b;Ext.Array.push(this.bytes,a)},convertXmlToString:function(b){var a;if(window.XMLSerializer){a=new window.XMLSerializer().serializeToString(b)}else {a=b.xml}return a},isXmlDocument:function(a){if(window.DOMParser){if(Ext.isDefined(a.doctype)){return !0}}if(Ext.isString(a.xml)){return !0}return !1},encodeDouble:function(a){var l=11,h=52;var i=(1<<(l-1))-1,k,d,e,j,f,b,g,c=[];var n=[127,240,0,0,0,0,0,0],m=[255,240,0,0,0,0,0,0],o=[255,248,0,0,0,0,0,0];if(isNaN(a)){c=o}else if(a===Infinity){c=n}else if(a==-Infinity){c=m}else {if(a===0){d=0;e=0;k=(1/a===-Infinity)?1:0}else {k=a<0;a=Math.abs(a);if(a>=Math.pow(2,1-i)){j=Math.min(Math.floor(Math.log(a)/Math.LN2),i);d=j+i;e=Math.round(a*Math.pow(2,h-j)-Math.pow(2,h))}else {d=0;e=Math.round(a/Math.pow(2,1-i-h))}}b=[];for(f=h;f;f-=1){b.push(e%2?1:0);e=Math.floor(e/2)}for(f=l;f;f-=1){b.push(d%2?1:0);d=Math.floor(d/2)}b.push(k?1:0);b.reverse();g=b.join('');c=[];while(g.length){c.push(parseInt(g.substring(0,8),2));g=g.substring(8)}}return c},write0ShortUtf8String:function(c){var a=this.encodeUtf8String(c),b;b=this.encodeXInt(a.length,2);this.writeBytes(b);this.writeBytes(a)},writeAmfPacket:function(c,b){var a;this.writeBytes([0,0]);this.writeBytes(this.encodeXInt(c.length,2));for(a in c){this.writeAmfHeader(c[a].name,c[a].mustUnderstand,c[a].value)}this.writeBytes(this.encodeXInt(b.length,2));for(a in b){this.writeAmfMessage(b[a].targetUri,b[a].responseUri,b[a].body)}},writeAmfHeader:function(b,a,c){this.write0ShortUtf8String(b);var d=a?1:0;this.writeByte(d);this.writeBytes(this.encodeXInt(-1,4));this.writeObject(c)},writeAmfMessage:function(b,a,c){this.write0ShortUtf8String(b);this.write0ShortUtf8String(a);this.writeBytes(this.encodeXInt(-1,4));this.write0StrictArray(c)}});Ext.define('Ext.data.amf.Packet',function(){var f=Math.pow(2,-52),g=Math.pow(2,8),a=0,c,d,b,e;return {typeMap:{0:{0:'readDouble',1:'readBoolean',2:'readAmf0String',3:'readAmf0Object',5:'readNull',6:'readUndefined',7:'readReference',8:'readEcmaArray',10:'readStrictArray',11:'readAmf0Date',12:'readLongString',13:'readUnsupported',15:'readAmf0Xml',16:'readTypedObject'},3:{0:'readUndefined',1:'readNull',2:'readFalse',3:'readTrue',4:'readUInt29',5:'readDouble',6:'readAmf3String',7:'readAmf3Xml',8:'readAmf3Date',9:'readAmf3Array',10:'readAmf3Object',11:'readAmf3Xml',12:'readByteArray'}},decode:function(i){var f=this,k=f.headers=[],j=f.messages=[],h,g;a=0;c=f.bytes=i;d=f.strings=[];b=f.objects=[];e=f.traits=[];f.version=f.readUInt(2);for(h=f.readUInt(2);h--;){k.push({name:f.readAmf0String(),mustUnderstand:f.readBoolean(),byteLength:f.readUInt(4),value:f.readValue()});d=f.strings=[];b=f.objects=[];e=f.traits=[]}for(g=f.readUInt(2);g--;){j.push({targetURI:f.readAmf0String(),responseURI:f.readAmf0String(),byteLength:f.readUInt(4),body:f.readValue()});d=f.strings=[];b=f.objects=[];e=f.traits=[]}a=0;c=d=b=e=f.bytes=f.strings=f.objects=f.traits=null;return f},decodeValue:function(g){var f=this;c=f.bytes=g;a=0;f.version=3;d=f.strings=[];b=f.objects=[];e=f.traits=[];return f.readValue()},parseXml:function(b){var a;if(window.DOMParser){a=(new DOMParser()).parseFromString(b,"text/xml")}else {a=new ActiveXObject("Microsoft.XMLDOM");a.loadXML(b)}return a},readAmf0Date:function(){var b=new Date(this.readDouble());a+=2;return b},readAmf0Object:function(d){var f=this,e;d=d||{};b.push(d);while((e=f.readAmf0String())||c[a]!==9){d[e]=f.readValue()}a++;return d},readAmf0String:function(){return this.readUtf8(this.readUInt(2))},readAmf0Xml:function(){return this.parseXml(this.readLongString())},readAmf3Array:function(){var d=this,f=d.readUInt29(),g,e,a,c;if(f&1){g=(f>>1);e=d.readAmf3String();if(e){a={};b.push(a);do{a[e]=d.readValue()}while((e=d.readAmf3String()));for(c=0;c<g;c++){a[c]=d.readValue()}}else {a=[];b.push(a);for(c=0;c<g;c++){a.push(d.readValue())}}}else {a=b[f>>1]}return a},readAmf3Date:function(){var d=this,c=d.readUInt29(),a;if(c&1){a=new Date(d.readDouble());b.push(a)}else {a=b[c>>1]}return a},readAmf3Object:function(){var h=this,d=h.readUInt29(),i=[],m,j,c,k,g,a,n,l,f;if(d&1){m=(d&7);if(m===3){c=h.readAmf3String();k=!!(d&8);j=(d>>4);for(f=0;f<j;f++){i.push(h.readAmf3String())}g={className:c,dynamic:k,members:i};e.push(g)}else if((d&3)===1){g=e[d>>2];c=g.className;k=g.dynamic;i=g.members;j=i.length}else if(m===7){}if(c){l=Ext.ClassManager.getByAlias('amf.'+c);a=l?new l():{$className:c}}else {a={}}b.push(a);for(f=0;f<j;f++){a[i[f]]=h.readValue()}if(k){while((n=h.readAmf3String())){a[n]=h.readValue()}}if((!l)&&this.converters[c]){a=this.converters[c](a)}}else {a=b[d>>1]}return a},readAmf3String:function(){var c=this,b=c.readUInt29(),a;if(b&1){a=c.readUtf8(b>>1);if(a){d.push(a)}return a}else {return d[b>>1]}},readAmf3Xml:function(){var d=this,c=d.readUInt29(),a;if(c&1){a=d.parseXml(d.readUtf8(c>>1));b.push(a)}else {a=b[c>>1]}return a},readBoolean:function(){return !!c[a++]},readByteArray:function(){var e=this.readUInt29(),d,f;if(e&1){f=a+(e>>1);d=Array.prototype.slice.call(c,a,f);b.push(d);a=f}else {d=b[e>>1]}return d},readDouble:function(){var e=c[a++],h=c[a++],i=(e>>7)?-1:1,d=(((e&127)<<4)|(h>>4)),b=(h&15),j=d?1:0,k=6;while(k--){b=(b*g)+c[a++]}if(!d){if(!b){return 0}d=1}if(d===2047){return b?NaN:(Infinity*i)}return i*Math.pow(2,d-1023)*(j+f*b)},readEcmaArray:function(){a+=4;return this.readAmf0Object()},readFalse:function(){return !1},readLongString:function(){return this.readUtf8(this.readUInt(4))},readNull:function(){return null},readReference:function(){return b[this.readUInt(2)]},readStrictArray:function(){var c=this,d=c.readUInt(4),a=[];b.push(a);while(d--){a.push(c.readValue())}return a},readTrue:Ext.returnTrue,readTypedObject:function(){var e=this,a=e.readAmf0String(),b,c,d;b=Ext.ClassManager.getByAlias('amf.'+a);c=b?new b():{$className:a};d=e.readAmf0Object(c);if((!b)&&this.converters[a]){d=this.converters[a](c)}return d},readUInt:function(e){var d=1,b;b=c[a++];for(;d<e;++d){b=(b<<8)|c[a++]}return b},readUInt29:function(){var d=c[a++],b;if(d&128){b=c[a++];d=((d&127)<<7)|(b&127);if(b&128){b=c[a++];d=(d<<7)|(b&127);if(b&128){b=c[a++];d=(d<<8)|b}}}return d},readUndefined:Ext.emptyFn,readUnsupported:Ext.emptyFn,readUtf8:function(l){var m=a+l,f=[],i=0,k=65535,h=1,j=[],g=0,e,d,b;e=[f];while(a<m){b=c[a++];if(b>127){if(b>239){d=4;b=(b&7)}else if(b>223){d=3;b=(b&15)}else {d=2;b=(b&31)}while(--d){b=((b<<6)|(c[a++]&63))}}f.push(b);if(++i===k){e.push(f=[]);i=0;h++}}for(;g<h;g++){j.push(String.fromCharCode.apply(String,e[g]))}return j.join('')},readValue:function(){var b=this,d=c[a++];if(d===17){b.version=3;d=c[a++]}return b[b.typeMap[b.version][d]]()},converters:{'flex.messaging.io.ArrayCollection':function(a){return a.source||[]}}}});Ext.define('Ext.data.amf.Reader',{extend:'Ext.data.reader.Json',alias:'reader.amf',requires:['Ext.data.amf.Packet'],messageIndex:0,read:function(f){var d=this,e=f.responseBytes,b,c,a;if(!e){throw "AMF Reader cannot process the response because it does not contain binary data. Make sure the Proxy's 'binary' config is true."}b=new Ext.data.amf.Packet();b.decode(e);c=b.messages;if(c.length){a=d.readRecords(c[d.messageIndex].body)}else {a=d.nullResultSet;if(b.invalid){a.success=!1}}return a}});Ext.define('Ext.data.amf.Proxy',{extend:'Ext.data.proxy.Ajax',alias:'proxy.amf',requires:['Ext.data.amf.Reader'],binary:!0,reader:'amf'});Ext.define('Ext.data.amf.RemotingMessage',{alias:'data.amf.remotingmessage',config:{$flexType:'flex.messaging.messages.RemotingMessage',body:[],clientId:"",destination:"",headers:[],messageId:"",operation:"",source:"",timestamp:[],timeToLive:[]},constructor:function(a){this.initConfig(a)},encodeMessage:function(){var b=Ext.create('Ext.data.amf.XmlEncoder'),a;a=Ext.copyTo({},this,"$flexType,body,clientId,destination,headers,messageId,operation,source,timestamp,timeToLive",!0);b.writeObject(a);return b.body}});Ext.define('Ext.data.amf.XmlDecoder',{alias:'data.amf.xmldecoder',statics:{readXml:function(b){var a;if(window.DOMParser){a=(new DOMParser()).parseFromString(b,"text/xml")}else {a=new ActiveXObject("Microsoft.XMLDOM");a.loadXML(b)}return a},readByteArray:function(e){var c=[],d,a,b;b=e.firstChild.nodeValue;for(a=0;a<b.length;a=a+2){d=b.substr(a,2);c.push(parseInt(d,16))}return c},readAMF3Value:function(b){var a;a=Ext.create('Ext.data.amf.Packet');return a.decodeValue(b)},decodeTidFromFlexUID:function(b){var a;a=b.substr(0,8);return parseInt(a,16)}},constructor:function(a){this.initConfig(a);this.clear()},clear:function(){this.objectReferences=[];this.traitsReferences=[];this.stringReferences=[]},readAmfxMessage:function(f){var e,d,a,b,c={};this.clear();e=Ext.data.amf.XmlDecoder.readXml(f);d=e.getElementsByTagName('amfx')[0];a=d.getElementsByTagName('body')[0];c.targetURI=a.getAttribute('targetURI');c.responseURI=a.getAttribute('responseURI');for(b=0;b<a.childNodes.length;b++){if(a.childNodes.item(b).nodeType!=1){continue}c.message=this.readValue(a.childNodes.item(b));break}return c},readValue:function(a){var b;if(typeof a.normalize==='function'){a.normalize()}if(a.tagName=="null"){return null}else if(a.tagName=="true"){return !0}else if(a.tagName=="false"){return !1}else if(a.tagName=="string"){return this.readString(a)}else if(a.tagName=="int"){return parseInt(a.firstChild.nodeValue)}else if(a.tagName=="double"){return parseFloat(a.firstChild.nodeValue)}else if(a.tagName=="date"){b=new Date(parseFloat(a.firstChild.nodeValue));this.objectReferences.push(b);return b}else if(a.tagName=="dictionary"){return this.readDictionary(a)}else if(a.tagName=="array"){return this.readArray(a)}else if(a.tagName=="ref"){return this.readObjectRef(a)}else if(a.tagName=="object"){return this.readObject(a)}else if(a.tagName=="xml"){return Ext.data.amf.XmlDecoder.readXml(a.firstChild.nodeValue)}else if(a.tagName=="bytearray"){return Ext.data.amf.XmlDecoder.readAMF3Value(Ext.data.amf.XmlDecoder.readByteArray(a))}return null},readString:function(a){var b;if(a.getAttributeNode('id')){return this.stringReferences[parseInt(a.getAttribute('id'))]}b=(a.firstChild?a.firstChild.nodeValue:"")||"";this.stringReferences.push(b);return b},readTraits:function(a){var d=[],b,c;if(a===null){return null}if(a.getAttribute('externalizable')=="true"){return null}if(a.getAttributeNode('id')){return this.traitsReferences[parseInt(a.getAttributeNode('id').value)]}c=a.childNodes;for(b=0;b<c.length;b++){if(c.item(b).nodeType!=1){continue}d.push(this.readValue(c.item(b)))}this.traitsReferences.push(d);return d},readObjectRef:function(b){var a;a=parseInt(b.getAttribute('id'));return this.objectReferences[a]},readObject:function(c){var b,i=[],h,e,f,g,j,k,d=null,a;a=c.getAttribute('type');if(a){d=Ext.ClassManager.getByAlias('amfx.'+a)}b=d?new d():(a?{$className:a}:{});if((!d)&&this.converters[a]){b=this.converters[a](this,c);return b}h=c.getElementsByTagName('traits')[0];i=this.readTraits(h);this.objectReferences.push(b);f=0;for(e=0;e<c.childNodes.length;e++){g=c.childNodes.item(e);if(g.nodeType!=1){continue}if(g.tagName=="traits"){continue}j=i[f];k=this.readValue(g);f=f+1;b[j]=k}return b},readArray:function(f){var b=[],a,h,c,d,i,j,k,e,g;this.objectReferences.push(b);k=parseInt(f.getAttributeNode('length').value);h=0;for(d=0;d<f.childNodes.length;d++){a=f.childNodes.item(d);if(a.nodeType!=1){continue}if(a.tagName=="item"){i=a.getAttributeNode('name').value;e=a.childNodes;for(c=0;c<e.length;c++){g=e.item(c);if(g.nodeType!=1){continue}j=this.readValue(g);break}b[i]=j}else {b[h]=this.readValue(a);h++}}return b},readDictionary:function(f){var e={},a,b,c,g,d,h;h=parseInt(f.getAttribute('length'));this.objectReferences.push(e);a=null;b=null;g=0;for(c=0;c<f.childNodes.length;c++){d=f.childNodes.item(c);if(d.nodeType!=1){continue}if(!a){a=this.readValue(d);continue}b=this.readValue(d);g=g+1;e[a]=b;a=null;b=null}return e},convertObjectWithSourceField:function(d){var a,c,b;for(a=0;a<d.childNodes.length;a++){c=d.childNodes.item(a);if(c.tagName=="bytearray"){b=this.readValue(c);this.objectReferences.push(b);return b}}return null},converters:{'flex.messaging.io.ArrayCollection':function(a,b){return a.convertObjectWithSourceField(b)},'mx.collections.ArrayList':function(a,b){return a.convertObjectWithSourceField(b)},'mx.collections.ArrayCollection':function(a,b){return a.convertObjectWithSourceField(b)}}});Ext.define('Ext.data.amf.XmlEncoder',{alias:'data.amf.xmlencoder',body:"",statics:{generateFlexUID:function(e){var b="",a,d,c;if(e===undefined){e=Ext.Number.randomInt(0,4.294967295E9)}c=(e+4.294967296E9).toString(16).toUpperCase();b=c.substr(c.length-8,8);for(d=0;d<3;d++){b+="-";for(a=0;a<4;a++){b+=Ext.Number.randomInt(0,15).toString(16).toUpperCase()}}b+="-";c=new Number(new Date()).valueOf().toString(16).toUpperCase();d=0;if(c.length<8){for(a=0;a<c.length-8;a++){d++;b+="0"}}b+=c.substr(-(8-d));for(a=0;a<4;a++){b+=Ext.Number.randomInt(0,15).toString(16).toUpperCase()}return b}},constructor:function(a){this.initConfig(a);this.clear()},clear:function(){this.body=""},encodeUndefined:function(){return this.encodeNull()},writeUndefined:function(){this.write(this.encodeUndefined())},encodeNull:function(){return "<null />"},writeNull:function(){this.write(this.encodeNull())},encodeBoolean:function(b){var a;if(b){a="<true />"}else {a="<false />"}return a},writeBoolean:function(a){this.write(this.encodeBoolean(a))},encodeString:function(b){var a;if(b===""){a="<string />"}else {a="<string>"+b+"</string>"}return a},writeString:function(a){this.write(this.encodeString(a))},encodeInt:function(a){return "<int>"+a.toString()+"</int>"},writeInt:function(a){this.write(this.encodeInt(a))},encodeDouble:function(a){return "<double>"+a.toString()+"</double>"},writeDouble:function(a){this.write(this.encodeDouble(a))},encodeNumber:function(a){var c=536870911,b=-268435455;if(a instanceof Number){a=a.valueOf()}if(a%1===0&&a>=b&&a<=c){return this.encodeInt(a)}else {return this.encodeDouble(a)}},writeNumber:function(a){this.write(this.encodeNumber(a))},encodeDate:function(a){return "<date>"+(new Number(a)).toString()+"</date>"},writeDate:function(a){this.write(this.encodeDate(a))},encodeEcmaElement:function(b,a){var c='<item name="'+b.toString()+'">'+this.encodeObject(a)+'</item>';return c},encodeArray:function(f){var b=[],e,d=[],g=f.length,a,c;for(a in f){if(Ext.isNumeric(a)&&(a%1==0)){b[a]=this.encodeObject(f[a])}else {d.push(this.encodeEcmaElement(a,f[a]))}}e=b.length;for(a=0;a<b.length;a++){if(b[a]===undefined){e=a;break}}if(e<b.length){for(a=firstNonOrdinals;a<b.length;a++){if(b[a]!==undefined){d.push(this.encodeEcmaElement(a,b[a]))}}b=b.slice(0,e)}c='<array length="'+b.length+'"';if(d.length>0){c+=' ecma="true"'}c+='>';for(a=0;a<b.length;a++){c+=b[a]}for(a in d){c+=d[a]}c+='</array>';return c},writeArray:function(a){this.write(this.encodeArray(a))},encodeXml:function(b){var a=this.convertXmlToString(b);return "<xml><![CDATA["+a+"]]></xml>"},writeXml:function(a){this.write(this.encodeXml(a))},encodeGenericObject:function(e){var d=[],f=[],c=null,b,a;for(b in e){if(b=="$flexType"){c=e[b]}else {d.push(this.encodeString(new String(b)));f.push(this.encodeObject(e[b]))}}if(c){a='<object type="'+c+'">'}else {a="<object>"}if(d.length>0){a+="<traits>";a+=d.join("");a+="</traits>"}else {a+="<traits />"}a+=f.join("");a+="</object>";return a},writeGenericObject:function(a){this.write(this.encodeGenericObject(a))},encodeByteArray:function(c){var a,b,d;if(c.length>0){a="<bytearray>";for(b=0;b<c.length;b++){d=c[b].toString(16).toUpperCase();if(c[b]<16){d="0"+d}a+=d}a+="</bytearray>"}else {a="<bytearray />"}return a},writeByteArray:function(a){this.write(this.encodeByteArray(a))},encodeObject:function(a){var b=typeof (a);if(b==="undefined"){return this.encodeUndefined()}else if(a===null){return this.encodeNull()}else if(Ext.isBoolean(a)){return this.encodeBoolean(a)}else if(Ext.isString(a)){return this.encodeString(a)}else if(b==="number"||a instanceof Number){return this.encodeNumber(a)}else if(b==="object"){if(a instanceof Date){return this.encodeDate(a)}else if(Ext.isArray(a)){return this.encodeArray(a)}else if(this.isXmlDocument(a)){return this.encodeXml(a)}else {return this.encodeGenericObject(a)}}else {}return null},writeObject:function(a){this.write(this.encodeObject(a))},encodeAmfxRemotingPacket:function(b){var c,a;a='<amfx ver="3" xmlns="http://www.macromedia.com/2005/amfx"><body>';a+=b.encodeMessage();a+='</body></amfx>';return a},writeAmfxRemotingPacket:function(a){this.write(this.encodeAmfxRemotingPacket(a))},convertXmlToString:function(b){var a;if(window.XMLSerializer){a=new window.XMLSerializer().serializeToString(b)}else {a=b.xml}return a},isXmlDocument:function(a){if(window.DOMParser){if(Ext.isDefined(a.doctype)){return !0}}if(Ext.isString(a.xml)){return !0}return !1},write:function(a){this.body+=a}});Ext.define('Ext.direct.AmfRemotingProvider',{alias:'direct.amfremotingprovider',extend:'Ext.direct.Provider',requires:['Ext.util.MixedCollection','Ext.util.DelayedTask','Ext.direct.Transaction','Ext.direct.RemotingMethod','Ext.data.amf.XmlEncoder','Ext.data.amf.XmlDecoder','Ext.data.amf.Encoder','Ext.data.amf.Packet','Ext.data.amf.RemotingMessage','Ext.direct.ExceptionEvent'],binary:!1,maxRetries:1,timeout:undefined,constructor:function(b){var a=this;a.callParent(arguments);a.namespace=(Ext.isString(a.namespace))?Ext.ns(a.namespace):a.namespace||window;a.transactions=new Ext.util.MixedCollection();a.callBuffer=[]},initAPI:function(){var d=this.actions,g=this.namespace,a,b,e,c,h,f;for(a in d){if(d.hasOwnProperty(a)){b=g[a];if(!b){b=g[a]={}}e=d[a];for(c=0,h=e.length;c<h;++c){f=new Ext.direct.RemotingMethod(e[c]);b[f.name]=this.createHandler(a,f)}}}},createHandler:function(c,b){var d=this,a;if(!b.formHandler){a=function(){d.configureRequest(c,b,Array.prototype.slice.call(arguments,0))}}else {a=function(f,a,e){d.configureFormRequest(c,b,f,a,e)}}a.directCfg={action:c,method:b};return a},isConnected:function(){return !!this.connected},connect:function(){var a=this;if(a.url){a.clientId=Ext.data.amf.XmlEncoder.generateFlexUID();a.initAPI();a.connected=!0;a.fireEvent('connect',a);a.DSId=null}else if(!a.url){}},disconnect:function(){var a=this;if(a.connected){a.connected=!1;a.fireEvent('disconnect',a)}},runCallback:function(e,b){var c=!!b.status,f=c?'success':'failure',a,d;if(e&&e.callback){a=e.callback;d=Ext.isDefined(b.result)?b.result:b.data;if(Ext.isFunction(a)){a(d,b,c)}else {Ext.callback(a[f],a.scope,[d,b,c]);Ext.callback(a.callback,a.scope,[d,b,c])}}},onData:function(i,j,h){var b=this,d=0,e,g,c,a,f;if(j){g=b.createEvents(h);for(e=g.length;d<e;++d){c=g[d];a=b.getTransaction(c);b.fireEvent('data',b,c);if(a){b.runCallback(a,c,!0);Ext.direct.Manager.removeTransaction(a)}}}else {f=[].concat(i.transaction);for(e=f.length;d<e;++d){a=b.getTransaction(f[d]);if(a&&a.retryCount<b.maxRetries){a.retry()}else {c=new Ext.direct.ExceptionEvent({data:null,transaction:a,code:Ext.direct.Manager.exceptions.TRANSPORT,message:'Unable to connect to the server.',xhr:h});b.fireEvent('data',b,c);if(a){b.runCallback(a,c,!1);Ext.direct.Manager.removeTransaction(a)}}}}},getTransaction:function(a){return a&&a.tid?Ext.direct.Manager.getTransaction(a.tid):null},configureRequest:function(h,c,g){var a=this,d=c.getCallData(g),i=d.data,e=d.callback,f=d.scope,b;b=new Ext.direct.Transaction({provider:a,args:g,action:h,method:c.name,data:i,callback:f&&Ext.isFunction(e)?e.bind(f):e});if(a.fireEvent('beforecall',a,b,c)!==!1){Ext.direct.Manager.addTransaction(b);a.queueTransaction(b);a.fireEvent('call',a,b,c)}},getCallData:function(a){if(this.binary){return {targetUri:a.action+"."+a.method,responseUri:'/'+a.id,body:a.data||[]}}else {return new Ext.data.amf.RemotingMessage({body:a.data||[],clientId:this.clientId,destination:a.action,headers:{DSEndpoint:this.endpoint,DSId:this.DSId||"nil"},messageId:Ext.data.amf.XmlEncoder.generateFlexUID(a.id),operation:a.method,timestamp:0,timeToLive:0})}},sendRequest:function(d){var a=this,c={url:a.url,callback:a.onData,scope:a,transaction:d,timeout:a.timeout},i,f=0,g,j,b,e=[],h=[];if(Ext.isArray(d)){for(g=d.length;f<g;++f){e.push(a.getCallData(d[f]))}}else {e.push(a.getCallData(d))}if(a.binary){b=new Ext.data.amf.Encoder({format:0});b.writeAmfPacket(h,e);c.binaryData=b.bytes;c.binary=!0;c.headers={'Content-Type':'application/x-amf'}}else {b=new Ext.data.amf.XmlEncoder();b.writeAmfxRemotingPacket(e[0]);c.xmlData=b.body}Ext.Ajax.request(c)},queueTransaction:function(c){var a=this,b=!1;if(c.form){a.sendFormRequest(c);return}a.callBuffer.push(c);if(b){if(!a.callTask){a.callTask=new Ext.util.DelayedTask(a.combineAndSend,a)}a.callTask.delay(Ext.isNumber(b)?b:10)}else {a.combineAndSend()}},combineAndSend:function(){var a=this.callBuffer,b=a.length;if(b>0){this.sendRequest(b==1?a[0]:a);this.callBuffer=[]}},configureFormRequest:function(b,c,e,a,d){},sendFormRequest:function(a){},createEvents:function(d){var a=null,g=[],e=[],f,c=0,h,b;try{if(this.binary){b=new Ext.data.amf.Packet();a=b.decode(d.responseBytes)}else {b=new Ext.data.amf.XmlDecoder();a=b.readAmfxMessage(d.responseText)}}catch(i){f=new Ext.direct.ExceptionEvent({data:i,xhr:d,code:Ext.direct.Manager.exceptions.PARSE,message:'Error parsing AMF response: \n\n '+a});return [f]}if(this.binary){for(c=0;c<a.messages.length;c++){e.push(this.createEvent(a.messages[c]))}}else {e.push(this.createEvent(a))}return e},createEvent:function(a){var e=a.targetURI.split("/"),d,f,c,b,g=this;if(g.binary){d=e[1];b=2}else {d=Ext.data.amf.XmlDecoder.decodeTidFromFlexUID(a.message.correlationId);b=1}if(e[b]=="onStatus"){c={tid:d,data:(g.binary?a.body:a.message)};f=Ext.create('direct.exception',c)}else if(e[b]=="onResult"){c={tid:d,data:(g.binary?a.body:a.message.body)};f=Ext.create('direct.rpc',c)}else {}return f}});