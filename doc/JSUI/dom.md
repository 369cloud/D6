# 前端开发框架Dom使用指南
***
Dom是一款专门针对移动端的JS库，集成了大部分常用DOM操作API，你不需要学习任何新的东西，其用法和jQuery几乎是一样的。

创建一个Dom对象很简单只需通过	$	对象即可

	$(selector, [context])   ⇒ collection   
PS. 参数中带有 [  ] 的意指可选的意思

#索引
***

###[Dom](#$)

-	[$](#$) 
-	[addClass](#addClass)  
-	[after](#after) 
-	[append](#append) 
-	[appendTo](#appendTo) 
-	[attr](#attr) 
-	[before](#before)
-	[button](#button)
-	[checkbox](#checkbox) 
-	[children](#children)  
-	[closest](#closest)
-	[concat](#concat) 
-	[css](#css) 
-	[data](#data) 
-	[each](#each) 
-	[eq](#eq) 
-	[filter](#filter) 
-	[find](#find) 
-	[first](#first) 
-	[get](#get) 
-	[hasClass](#hasClass) 
-	[height](#height) 
-	[hide](#hide) 
-	[html](#html) 
-	[insertAfter](#insertAfter) 
-	[insertBefore](#insertBefore) 
-	[is](#is) 
-	[last](#last) 
-	[next](#next) 
-	[nextAll](#nextAll) 
-	[not](#not) 
-	[offset](#offset) 
-	[parent](#parent) 
-	[parents](#parents)
-	[prepend](#prepend) 
-	[prependTo](#prependTo) 
-	[prev](#prev) 
-	[prevAll](#prevAll)  
-	[prop](#prop) 
-	[radio](#radio) 
-	[remove](#remove)  
-	[removeAttr](#removeAttr) 
-	[removeClass](#removeClass) 
-	[select](#select) 
-	[show](#show) 
-	[text](#text) 
-	[toggleClass](#toggleClass) 
-	[val](#val) 
-	[width](#width) 
-	[wrap](#wrap) 
-	[wrapAll](#wrapAll) 



###[Utilities](#Utilities)

-	[$.camelCase](#$.camelCase) 
-   [$.cellPhone]($.cellPhone)
-   [$.charOne]($.charOne)
-   [$.chk]($.chk)
-	[$.contains](#$.contains)
-   [$.daysBetween]($.daysBetween)
-	[$.each](#$.each)
-   [$.email]($.email)
-	[$.extend](#$.extend)
-   [$.formatDateToString]($.formatDateToString)
-   [$.formatStringToDate]($.formatStringToDate)
-   [$.getBytesLength]($.getBytesLength)
-   [$.getDays]($.getDays)
-   [$.idcard]($.idcard)
-	[$.isArray](#$.isArray)
-   [$.isDigit]($.isDigit)
-	[$.isFunction](#$.isFunction)
-	[$.isPlainObject](#$.isPlainObject)
-   [$.isRegisterUserName]($.isRegisterUserName)
-	[$.isWindow](#$.isWindow)
-	[$.map](#$.map)
-   [$.milliseconds]($.milliseconds)
-   [$.msToDateStr]($.msToDateStr)
-	[$.parseJSON](#$.parseJSON)
-	[$.parseUrlQuery](#$.parseUrlQuery)
-   [$.registerPasswd]($.registerPasswd)
-	[$.serializeObject](#$.serializeObject)
-	[$.trim](#$.trim)
-	[$.trimAll](#$.trimAll)
-	[$.trimLeft](#$.trimLeft)
-	[$.trimRight](#$.trimRight)
-	[$.type](#$.type)
-   [$.upperCharOne]($.upperCharOne)


###[Event](#Event)

-	[$.Event](#$.Event)
-	[$.proxy](#$.proxy)
-	[off](#off)
-	[on](#on)
-	[one](#one)
-	[trigger](#trigger)
-	[Touch events](#Touch)



###[AJAX](#AJAX)

-	[$.ajax](#$.ajax)
-	[$.get](#$.get)
-	[$.getJSON](#$.getJSON)
-	[$.param](#$.param)
-	[$.post](#$.post)

***

# <div id="$">$</div>
***
-	$(selector, [context])   ⇒ collection
-	$(<Dom collection>)   ⇒ same collection
-	$(<DOM nodes>)   ⇒ collection
-	$(htmlString)   ⇒ collection
通过执行css选择器，包装DOM节点，或者通过一个html字符串创建多个元素 来创建一个Dom集合对象。

Dom集合是一个类似数组的对象，它具有链式方法来操作它指向的DOM节点，除了 $ 对象上的直接方法外(如$.extend)，文档对象中的所有方法都是集合方法。

如果选择器中存在content参数(css选择器，DOM，或者Dom集合对象)，那么只在所给的节点背景下进行css选择器；这个功能和使用$(context).find(selector)是一样的。

当给定一个html字符串可快速创建一个DOM节点。

	$('div')  //=> 所有页面中的div元素
	$('#foo') //=> ID 为 "foo" 的元素
	$('.foo') //=> class 为 "foo" 的元素
	// 创建元素:
	$("<p>Hello</p>") //=> 新的p元素

##<div id="addClass">addClass</div>
*	addClass(name)   ⇒ self			

为每个匹配的元素添加指定的class类名。多个class参数名称使用空格分隔。

	$('p').addClass('intro');

##<div id="after">after</div>
*	after(content)   ⇒ self			

在每个匹配的元素后插入内容。内容可以为html字符串，dom节点，或者节点组成的数组。

	$('#div').after('<p>Hello</p>')


##<div id="append">append</div>
*	append(content)   ⇒ self

在每个匹配的元素末尾插入内容（内部插入）。内容可以为html字符串，dom节点，或者Dom集合。

	$('ul').append('<li>new list item</li>')


##<div id="appendTo">appendTo</div>
*	appendTo(target)   ⇒ self

将匹配的元素插入到目标元素的末尾（内部插入）。这个有点像 append，但是插入的目标与其相反。

	$('<li>new list item</li>').appendTo('ul')

##<div id="attr">attr</div>
*	attr(name)   ⇒ string
*	attr(name, value)   ⇒ self
*	attr({ name: value, name2: value2, ... })   ⇒ self

读取或设置dom的属性。如果没有给定value参数，则读取对象集合中第一个元素的属性值。当给定了value参数。则设置对象集合中所有元素的该属性的值。当value参数为null，那么这个属性将被移除(类似removeAttr)，多个属性可以通过对象键值对的方式进行设置。

ps. 要读取DOM自身带有的属性如 checked和selected, 使用 prop。

	var form = $('form')
	form.attr('action')             //=> 读取值
	form.attr('action', '/create')  //=> 设置值
	form.attr('action', null)       //=> 移除属性
	
	// 多个属性:
	form.attr({
	  action: '/create',
	  method: 'post'
	})

##<div id="before">before</div>
*	before(content)   ⇒ self			

在匹配每个元素的前面插入内容。内容可以为html字符串，dom节点，或者节点组成的数组。

	$('#div').before('<p>Hello</p>')

##<div id="button">button</div>
*	button(function(targetEl,evt))   ⇒ collection

为获得每个匹配元素作为按钮添加点击事件，并触发回调函数传回点击对象与事件对象。

	$('.ui-btn').button(function(el,evt){
         alert($(el).html())
    })


##<div id="checkbox">checkbox</div>
*	checkbox(function(targetEl,evt))   ⇒ collection

为获得每个匹配元素内部的checkbox对象添加change事件，并触发回调函数传回点击对象与事件对象。

	$('.ui-input-group').checkbox(function(el,evt){
        if(el.checked)  alert($(el).val());
    }); 

##<div id="children">children</div>
*	children([selector])   ⇒ collection

获得每个匹配元素集合元素的直接子元素，如果给定selector，那么返回的结果中只包含符合css选择器的元素。

	$('ol').children('*:nth-child(2n)')
	//=> every other list item from every ordered list

##<div id="closest">closest</div>
*	closest(selector, [context])   ⇒ collection

从元素本身开始，逐级向上级元素匹配，并返回最先匹配selector的元素。如果给定context节点参数，那么只匹配该节点的后代元素。这个方法与 parents(selector)有点相像，但它只返回最先匹配的祖先元素。

	var input = $('input[type=text]')
	input.closest('form')

##<div id="concat">concat</div>
*	concat(nodes, [node2, ...])   ⇒ self

添加元素到一个Dom对象集合形成一个新数组。如果参数是一个数组，那么这个数组中的元素将会合并到Dom对象集合中。

##<div id="css">css</div>
*	css(property)   ⇒ value
*	css(property, value)   ⇒ self
*	css({ property: value, property2: value2, ... })   ⇒ self

读取或设置DOM元素的css属性。当value参数不存在的时候，返回对象集合中第一个元素的css属性。当value参数存在时，设置对象集合中每一个元素的对应css属性。

多个属性可以利用对象键值对的方式进行设置。

当value为空(空字符串，null 或 undefined)，那个css属性将会被移除。当value参数为一个无单位的数字，如果该css属性需要单位，“px”将会自动添加到该属性上。

	var elem = $('h1')
	elem.css('background-color')          // read property
	elem.css('background-color', '#369')  // set property
	elem.css('background-color', '')      // remove property
	
	// set multiple properties:
	elem.css({ backgroundColor: '#8EE', fontSize: 28 })

##<div id="data">data</div>
*	data(name)   ⇒ value
*	data(name, value)   ⇒ self

读取或写入dom的 data-* 属性。行为有点像 attr ，但是属性名称前面加上 data-。

##<div id="each">each</div>
*	each(function(index, item){ ... })   ⇒ self

遍历一个对象集合每个元素。在迭代函数中，this关键字指向当前项(作为函数的第二个参数传递)。如果迭代函数返回 false，遍历结束。

	$('form input').each(function(index){
	  console.log('input %d is: %o', index, this)
	})

##<div id="eq">eq</div>
*	eq(index)   ⇒ collection

从当前对象集合中获取给定索引值（以0为基数）的元素。

	$('li').eq(0)   //=> only the first list item
	$('li').eq(-1)  //=> only the last list item

##<div id="filter">filter</div>
*	filter(selector)   ⇒ collection
*	filter(function(index){ ... })   ⇒ collection 

过滤对象集合，返回对象集合中满足css选择器的项。如果参数为一个函数，函数返回有实际值的时候，元素才会被返回。在函数中， this 关键字指向当前的元素。

与此相反的功能，查看[not](#not).

##<div id="find">find</div>
*	find(selector)   ⇒ collection

在选中的每一个元素的后代中查找指定的元素。

	var form = $('#myform')
	form.find('input')

##<div id="first">first</div>
*	first()   ⇒ collection

获取当前对象集合中的第一个元素。

	('form').first()

##<div id="get">get</div>
*	get()   ⇒ array
*	get(index)   ⇒ DOM node

从当前对象集合中获取所有元素或单个元素。当index参数不存在的时，以普通数组的方式返回所有的元素。当指定index时，只返回该值的元素。这点与eq不同，该方法返回的是DOM节点，不是Dom对象集合。

	var elements = $('h2')
	elements.get()   //=> get all headings as an array
	elements.get(0)  //=> get first heading node

##<div id="hasClass">hasClass</div>
*	hasClass(name)   ⇒ boolean

检查对象集合中是否有元素含有指定的class。

		<ul>
		    <li>list item 1</li>
		    <li class="yaotaiyang">list item 2</li>
		    <li>list item 3</li>
		</ul>
		<p>a paragraph</p>
		
		<script type="text/javascript">
		    $("li").hasClass("yaotaiyang");
		  //=> true
		</script>

##<div id="height">height</div>
*	height()   ⇒ number
*	height(value)   ⇒ self

获取或设置匹配元素的值。当没有给定value参数，返回第一个元素的值。当给定value参数，那么将设置所有元素的值。

	$('#foo').height()   // => 123
	$(window).height()   // => 838 (viewport height)
	$(document).height() // => 22302


##<div id="hide">hide</div>
*	hide()   ⇒ self

通过设置css的属性display 为 none来将对象集合中的元素隐藏。

##<div id="html">html</div>
*	html()   ⇒ string
*	html(content)   ⇒ self

获取或设置对象集合中元素的HTML内容。当没有给定content参数时，返回对象集合中第一个元素的innerHtml。当给定content参数时，用其替换对象集合中每个元素的内容。

##<div id="insertAfter">insertAfter</div>
*	insertAfter(target)   ⇒ self

把当前选中的每一个元素插入到指定的目标之后。目标（target）应该是一个 CSS 选择器或者 HTML 元素 或者 Dom集合

	$('form label').insertAfter('<p>A note below the label</p>')

##<div id="insertBefore">insertBefore</div>
*	insertBefore(target)   ⇒ self

把当前选中的每一个元素插入到指定的目标之前（外部插入）。目标（target）应该是一个 CSS 选择器或者 HTML 元素 或者 Dom集合

	$('table').insertBefore('<p>See the following table:</p>')

##<div id="is">is</div>
*	is(CSSSelector)   ⇒ boolean
*	is(HTMLElement)   ⇒ boolean

判断当前元素集合中的第一个元素是否符合指定的CSS选择器
判断选中的元素是否是给定的 DOM 元素或者 Dom 集合

##<div id="last">last</div>
*	last()   ⇒ collection

获取对象集合中最后一个元素。

	$('li').last()

##<div id="next">next</div>
*	next()   ⇒ collection
*	next(selector)   ⇒ collection 

获取对象集合中每一个元素的下一个兄弟节点(可以选择性的带上过滤选择器)。

	$('dl dt').next()   //=> the DD elements

##<div id="nextAll">nextAll</div>
*	nextAll()   ⇒ collection
*	nextAll(selector)   ⇒ collection 

获得当前选中的每一个元素之后的全部兄弟元素。如果提供了一个选择器（selector），那么会用这个选择器来过滤这些兄弟元素。

	$('dl dt').nextAll()   //=> the DD elements

##<div id="not">not</div>
*	not(selector)   ⇒ collection
*	not(collection)   ⇒ collection
*	not(function(index){ ... })   ⇒ collection

过滤当前对象集合，获取一个新的对象集合，它里面的元素不能匹配css选择器。如果另一个参数为Dom对象集合，那么返回的新Dom对象中的元素都不包含在该参数对象中。如果参数是一个函数。仅仅包含函数执行为false值的时候的元素，函数的 this 关键字指向当前循环元素。

与它相反的功能，查看 [filter](#filter).


##<div id="offset">offset</div>
*	offset()   ⇒ object

获取当前选中元素的第一个元素相对 document 的位置偏移

##<div id="parent">parent</div>
*	parent([selector])   ⇒ collection

获取对象集合中每个元素的直接父元素。如果css选择器参数给出。过滤出符合条件的元素。

	$('h1').parent()   //=> [<div#container>]


##<div id="parents">parents</div>
*	parents([selector])   ⇒ collection

获取对象集合每个元素所有的祖先元素。如果css选择器参数给出，过滤出符合条件的元素。

如果想获取直接父级元素，使用 parent。如果只想获取到第一个符合css选择器的元素，使用closest。

	('h1').parents()   //=> [<div#container>, <body>, <html>]

##<div id="prepend">prepend</div>
*	prepend(content)   ⇒ self

将参数内容插入到每个匹配元素的前面（元素内部插入）。插入的元素可以是html字符串片段，一个dom节点，或者一个Dom集合。

	$('ul').prepend('<li>first list item</li>')


##<div id="prependTo">prependTo</div>
*	prependTo(target)   ⇒ self

将所有元素插入到目标前面（元素内部插入）。这有点像prepend，但是是相反的方式。

	$('<li>first list item</li>').prependTo('ul')

##<div id="prev">prev</div>
*	prev()   ⇒ collection
*	prev(selector)   ⇒ collection 

获取对象集合中每一个元素的前一个兄弟节点，通过选择器来进行过滤。


##<div id="prevAll">prevAll</div>
*	prevAll()   ⇒ collection
*	prevAll(selector)   ⇒ collection 

获得当前选中的每一个元素之前的全部兄弟元素。如果提供了一个选择器（selector），那么会用这个选择器来过滤这些兄弟元素。

##<div id="prop">prop</div>
*	prop(name)   ⇒ value
*	prop(name, value)   ⇒ self
*	prop({ name: value, name2: value2, ... })   ⇒ self

读取或设置dom元素的属性值。它在读取属性值的情况下优先于 attr，因为这些属性值会因为用户的交互发生改变，如checked 和 selected。

##<div id="radio">radio</div>
*	radio(function(targetEl,evt))   ⇒ collection

为获得每个匹配元素内部的radio对象添加change事件，并触发回调函数传回点击对象与事件对象。

	$('.ui-input-group').radio(function(el,evt){
        alert($(el).val());
    }); 

##<div id="remove">remove</div>
*	remove()   ⇒ self

从其父节点中删除当前集合中的元素，有效的从dom中移除。

##<div id="removeAttr">removeAttr</div>
*	removeAttr(name)   ⇒ self

移除当前对象集合中所有元素的指定属性。

##<div id="removeClass">removeClass</div>
*	removeClass([name])   ⇒ self			

移除当前对象集合中所有元素的指定class类名。多个class参数名称可以利用空格分隔。下例移除了两个class。

	<input class="taiyang yueliang" id="check1"/>

	<script type="text/javascript">
	    $("#check1").removeClass("taiyang yueliang")
	</script>

##<div id="select">select</div>
*	select(function(targetEl,evt))   ⇒ collection

为获得每个匹配元素内部的select对象添加change事件，并触发回调函数传回点击对象与事件对象。

	$('.ui-input-group').select(function(el,eve){
       alert($(el).val());
    }); 


##<div id="show">show</div>
*	show()   ⇒ self

恢复对象集合中每个元素默认的“display”值。如果你用 hide将元素隐藏，用该属性可以将其显示。相当于去掉了display：none。


##<div id="text">text</div>
*	text()   ⇒ string
*	text(content)   ⇒ self

获取或者设置所有对象集合中元素的文本内容。当没有给定content参数时，返回当前对象集合中第一个元素的文本内容。当给定content参数时，使用它替换对象集合中所有元素的文本内容。它有点像 html，与它不同的是它不能用来获取或设置 HTML。

##<div id="toggleClass">toggleClass</div>
*	toggleClass(names)   ⇒ self

在匹配的元素集合中的每个元素上添加或删除一个或多个样式类。如果class的名称存在则删除它，如果不存在，就添加它

##<div id="val">val</div>
*	val()   ⇒ string
*	val(value)   ⇒ self

获取或设置匹配元素的值。当没有给定value参数，返回第一个元素的值。当给定value参数，那么将设置所有元素的值。

##<div id="width">width</div>
*	width()   ⇒ number
*	width(value)   ⇒ self

获取或设置匹配元素的值。当没有给定value参数，返回第一个元素的值。当给定value参数，那么将设置所有元素的值。

	$('#foo').width()   // => 123
	$(window).width()   // => 768 (viewport width)
	$(document).width() // => 768 

##<div id="wrap">wrap</div>
*	wrap(structure)   ⇒ self
*	wrap(function(index){ ... })   ⇒ self

在每个匹配的元素外层包上一个html元素。structure参数可以是一个单独的元素或者一些嵌套的元素。也可以是一个html字符串片段或者dom节点。还可以是一个生成用来生成包含元素的回调函数，这个函数返回前两种类型的包裹片段。

需要提醒的是：该方法对于dom中的节点有着很好的支持。如果将wrap() 用在一个新的元素上，然后再将结果插入到document中，此时该方法无效。

	$('.buttons a').wrap('<span>')
	
	$('code').wrap('<div class=highlight><pre /></div>')
	
	$('input').wrap(function(index){
	  return '<span class=' + this.type + 'field />'
	})
	//=> <span class=textfield><input type=text /></span>,
	//   <span class=searchfield><input type=search /></span>
	
	// WARNING: will not work as expected!
	$('<em>broken</em>').wrap('<li>').appendTo(document.body)
	// do this instead:
	$('<em>better</em>').appendTo(document.body).wrap('<li>')

##<div id="wrapAll">wrapAll</div>


*	wrapAll(structure)   ⇒ self

在所有匹配元素外面包一个单独的结构。结构可以是单个元素或 几个嵌套的元素，并且可以通过在作为HTML字符串或DOM节点。

	$('a.button').wrapAll('<div id=buttons />')

#<div id="Utilities">Utilities</div> 
***
##<div id="$.camelCase">$.camelCase</div> 
*	$.camelCase(string)   ⇒ string

将一组字符串变成“骆驼”命名法的新字符串，如果该字符已经是“骆驼”命名法，则不变化。

	$.camelCase('hello-there') //=> "helloThere"
	$.camelCase('helloThere')  //=> "helloThere"

## <div id="$.cellPhone">$.cellPhone</div>
*	$.cellPhone(str)   ⇒ boolean

校验传入值是否符合手机号的规则

	var str = 13788289938;
	console.log($.cellPhone(str)); //-> true

## <div id="$.charOne">$.charOne</div>
*	$.charOne(str)   ⇒ boolean

校验：至少一个小写字母

	var str = ssas312323_33
	console.log($.charOne(str)); //-> true

## <div id="$.chk">$.chk</div>
*	$.chk(obj)   ⇒ boolean

判断传入对象是否为空（null，undefined，'undefined'，'null',''）

	  var str = 'null';
    console.log($.chk(str)) //-> flase

## <div id="$.contains">$.contains</div>
*	$.contains(parent, node)   ⇒ boolean

检查父节点是否包含给定的dom节点，如果两者是相同的节点，则返回 false。

## <div id="$.daysBetween">$.daysBetween</div>
*	$.daysBetween(dateStr，dateStr)   ⇒ Number

获取两个日期之间的天数

    $.daysBetween('2016-12-12','2016-02-12') //-> '2016-12-12'

##<div id="$.each">$.each</div>
*	$.each(collection, function(index, item){ ... })   ⇒ collection

遍历数组元素或以key-value值对方式遍历对象。回调函数返回 false 时停止遍历。

	$.each(['a', 'b', 'c'], function(index, item){
	  console.log('item %d is: %s', index, item)
	})
	
	var hash = { name: 'Dom.js', size: 'micro' }
	$.each(hash, function(key, value){
	  console.log('%s: %s', key, value)
	})

## <div id="$.extend">$.extend</div>
*	$.extend(target, [source, [source2, ...]])   ⇒ target
*	$.extend(true, target, [source, ...])   ⇒ target 

通过源对象扩展目标对象的属性，源对象属性将覆盖目标对象属性。

默认情况下为浅拷贝（浅复制）。如果第一个参数为true表示深度拷贝（深度复制）。

	var target = { one: 'patridge' },
	    source = { two: 'turtle doves' }
	
	$.extend(target, source)
	//=> { one: 'patridge',
	//     two: 'turtle doves' }

## <div id="$.email">$.email</div>
*	$.email(str)   ⇒ boolean

校验传入值是否符合邮箱的规则

	var str = 123@163.com;
	console.log($.email(str)); //-> true

## <div id="$.formatDateToString">$.formatDateToString</div>
*	$.formatDateToString(date,[format])   ⇒ String

将Date对象格式化成制定格式（默认格式：yyyy-MM-dd HH:mm:ss）的日期字符串

	  var date = new Date();
    $.formatDateToString(date，'yyyy-MM-dd') //-> '2016-12-12'

## <div id="$.formatStringToDate">$.formatStringToDate</div>
*	$.formatStringToDate(str)   ⇒ Date

将字符串转化为Date对象

	  var str = '2014-12-12';
    $.formatStringToDate(str) //-> Date

## <div id="$.getBytesLength">$.getBytesLength</div>
*	$.getBytesLength(str)   ⇒ number

获取字符串的字节长度

	  var str = '110101199111111474';
    console.log($.getBytesLength(str)) //-> 18

## <div id="$.getDays">$.getDays</div>
*	$.getDays([format])   ⇒ String

按指定格式（默认格式：yyyy-MM-dd HH:mm:ss）获取当前日期

    $.getDays('yyyy-MM-dd') //-> '2016-12-12'

## <div id="$.idcard">$.idcard</div>
*	$.idcard(str)   ⇒ boolean

身份证校验

	var str = 110101199111111474
	console.log($.idcard(str)); //-> true


##<div id="$.isArray">$.isArray</div>
*	$.isArray(object)   ⇒ boolean

如果object是array，则返回ture。

## <div id="$.isDigit">$.isDigit</div>
*	$.isDigit(str)   ⇒ boolean

校验传入值是否全部为数字

	var str = 1232333
	console.log($.isDigit(str)); //-> true

##<div id="$.isFunction">$.isFunction</div>
*	$.isFunction(object)   ⇒ boolean

如果object是function，则返回ture。

## <div id="$.isPlainObject">$.isPlainObject</div>
*	$.isPlainObject(object)   ⇒ boolean

测试对象是否是“纯粹”的对象，这个对象是通过 对象常量（"{}"） 或者 new Object 创建的，如果是，则返回true。

	$.isPlainObject({})         // => true
	$.isPlainObject(new Object) // => true
	$.isPlainObject(new Date)   // => false
	$.isPlainObject(window)     // => false

## <div id="$.isRegisterUserName">$.isRegisterUserName</div>
*	$.isRegisterUserName(str)   ⇒ boolean

校验登录名：只能输入5-20个以字母开头、可带数字、“_”、“.”的字串 

	var str = ssas312323_33
	console.log($.isRegisterUserName(str)); //-> true


## <div id="$.isWindow">$.isWindow</div>
*	$.isWindow(object)   ⇒ boolean

如果object参数为一个window对象，那么返回true。

##<div id="$.map">$.map</div>
*	$.map(collection, function(item, index){ ... })   ⇒ collection

通过遍历集合中的元素，返回通过迭代函数的全部结果，（一个新数组）null 和 undefined 将被过滤掉。

	$.map([1,2,3,4,5],function(item,index){
	        if(item>1){return item*item;}
	}); 
	// =>[4, 9, 16, 25]
	
	$.map({"yao":1,"tai":2,"yang":3},function(item,index){
	    if(item>1){return item*item;}
	}); 
	// =>[4, 9]

## <div id="$.milliseconds">$.milliseconds</div>
*	$.milliseconds(str)   ⇒ number

获取指定日期字符串的距 1970 年 1 月 1 日之间的毫秒数

	var str = '2014-12-12';
    $.milliseconds(str) //-> number

## <div id="$.msToDateStr">$.msToDateStr</div>
*	$.msToDateStr(num，[format])   ⇒ String

根据毫秒数获取指定格式（默认格式：yyyy-MM-dd HH:mm:ss）日期字符串

	var ms = 111111111111;
    $.msToDateStr(ms) //-> '2016-12-12'

## <div id="$.parseJSON">$.parseJSON</div>
*	$.parseJSON(string)   ⇒ object

原生JSON.parse方法的别名。（接受一个标准格式的 JSON 字符串，并返回解析后的 JavaScript 对象。）

## <div id="$.parseUrlQuery">$.parseUrlQuery</div>
*	$.parseUrlQuery(url)   ⇒ object

将url中传递的参数转换为JSON对象

	var query = $.parseUrlQuery('http://google.com/?id=5&foo=bar');
	console.log(query); //-> {id: 5, foo: 'bar'}

## <div id="$.registerPasswd">$.registerPasswd</div>
*	$.registerPasswd(str)   ⇒ boolean

校验密码：只能输入6-20个字母、数字、下划线   

	var str = ssas312323_33
	console.log($.registerPasswd(str)); //-> true

## <div id="$.serializeObject">$.serializeObject</div>
*	$.serializeObject(obj)   ⇒ String

将JSON对象转换为url中传递的参数

	var params = {foo: 'bar', id: 5};
	console.log($.serializeObject(params)); //-> 'foo=bar&id=5'

## <div id="$.trim">$.trim</div>
*	$.trim(string)   ⇒ string

删除字符串首尾的空白符。类似String.prototype.trim()。

## <div id="$.trimAll">$.trimAll</div>
*	$.trimAll(string)   ⇒ string

删除字符串所有的空白符。

## <div id="$.trimLeft">$.trimLeft</div>
*	$.trimLeft(string)   ⇒ string

删除字符串首尾的空白符。类似String.prototype.trimLeft()。

## <div id="$.trimRight">$.trimRight</div>
*	$.trimRight(string)   ⇒ string

删除字符串首尾的空白符。类似String.prototype.trimRight()。

## <div id="$.type">$.type</div>
*	$.type(object)   ⇒ string

获取JavaScript 对象的类型。可能的类型有： null、undefined、 boolean、 number、 string、 function 、array、 date、 regexp、 object、 error。

对于其它对象，它只是简单报告为“object”，如果你想知道一个对象是否是一个javascript普通对象，使用 isPlainObject。

## <div id="$.upperCharOne">$.upperCharOne</div>
*	$.upperCharOne(str)   ⇒ boolean

校验：至少一个大写字母

	var str = ssAs312323_33
	console.log($.upperCharOne(str)); //-> true

#<div id="Event">Event</div>
***
##<div id="$.Event">$.Event</div>
*	$.Event(type, [properties])   ⇒ event

创建并初始化一个指定的DOM事件。如果给定properties对象，使用它来扩展出新的事件对象。默认情况下，事件被设置为冒泡方式；这个可以通过设置bubbles为false来关闭。

一个事件初始化的函数可以使用 trigger来触发。

	$.Event('customEv', { bubbles: false })


## <div id="$.proxy">$.proxy</div>
*	$.proxy(fn, context)   ⇒ function
*	$.proxy(context, property)   ⇒ function

接受一个函数，然后返回一个新函数，并且这个新函数始终保持了特定的上下文(context)语境，新函数中this指向context参数。另外一种形式，原始的function是从上下文(context)对象的特定属性读取。

	var obj = {name: 'Dom'},
	    handler = function(){ console.log("hello from + ", this.name) }
	
	// ensures that the handler will be executed in the context of `obj`:
	$(document).on('click', $.proxy(handler, obj))


##	<div id="on">on</div>
*	on(type, [selector], function(e){ ... })   ⇒ self
*	on({ type: handler, type2: handler2, ... }, [selector])   ⇒ self

添加事件处理程序到对象集合中的元素上。多个事件可以通过空格的字符串方式添加，或者以事件类型为键、以函数为值的对象 方式。如果给定css选择器，当事件在匹配该选择器的元素上发起时，事件才会被触发（即事件委派，或者说事件代理）。

事件处理程序在添加该处理程序的元素、或在给定选择器情况下匹配该选择器的元素的上下文中执行(this指向触发事件的元素)。 当一个事件处理程序返回false，preventDefault() 和 stopPropagation()被当前事件调用的情况下，  将防止默认浏览器操作，如链接。

如果false 在回调函数的位置上作为参数传递给这个方法， 它相当于传递一个函数，这个函数直接返回false。（即将 false 当作 function(e){ ... } 的参数，作为 function(){ return false; } 的简写形式，例如： $("a.disabled").on("click", false);这相当于$("a.disabled").on("click", function(){ return false; } );）

	var elem = $('#content')
	// observe all clicks inside #content:
	elem.on('click', function(e){ ... })
	// observe clicks inside navigation links in #content
	elem.on('click', 'nav a', function(e){ ... })
	// all clicks inside links in the document
	$(document).on('click', 'a', function(e){ ... })
	// disable following any navigation link on the page
	$(document).on('click', 'nav a', false)



##<div id="off">off</div>
*	off(type, [selector], function(e){ ... })   ⇒ self
*	off({ type: handler, type2: handler2, ... }, [selector])   ⇒ self
*	off(type, [selector])   ⇒ self
*	off()   ⇒ self

移除通过 on 添加的事件.移除一个特定的事件处理程序， 必须通过用on()添加的那个相同的函数。否则，只通过事件类型调用此方法将移除该类型的所有处理程序。如果没有参数，将移出当前元素上全部的注册事件。


##<div id="one">one</div>
*	one(type, [selector], function(e){ ... })   ⇒ self
*	one({ type: handler, type2: handler2, ... }, [selector])   ⇒ self

添加一个处理事件到元素，当第一次执行事件以后，该事件将自动解除绑定，保证处理函数在每个元素上最多执行一次。selector 等参数说明请查看 [on()](#on)。


##<div id="trigger">trigger</div>
*	trigger(event, [args])   ⇒ self

在对象集合的元素上触发指定的事件。事件可以是一个字符串类型，也可以是一个 通过$.Event 定义的事件对象。如果给定args参数，它会作为参数传递给事件函数。

	// add a handler for a custom event
	$(document).on('customEv', function(e, from, to){
	  console.log('change on %o with data %s, %s', e.target, from, to)
	})
	// trigger the custom event
	$(document.body).trigger('customEv', ['one', 'two'])
	 仅仅支持在dom元素上触发事件。


##<div id="Touch">Touch events </div>

“touch”模块添加以下事件，可以使用 on 和 off。

*	tap —元素tap的时候触发。
*	singleTap and doubleTap — 这一对事件可以用来检测元素上的单击和双击。(如果你不需要检测单击、双击，使用 tap 代替)。
*	longTap — 当一个元素被按住超过750ms触发。
*	swipe, swipeLeft, swipeRight, swipeUp, swipeDown — 当元素被划过时触发。(可选择给定的方向)

这些事件也是所有Dom对象集合上的快捷方法。

	<style>.delete { display: none; }</style>
	
	<ul id=items>
	  <li>List item 1 <span class=delete>DELETE</span></li>
	  <li>List item 2 <span class=delete>DELETE</span></li>
	</ul>
	
	<script>
	// show delete buttons on swipe
	$('#items li').swipe(function(){
	  $('.delete').hide()
	  $('.delete', this).show()
	})
	
	// delete row on tapping delete button
	$('.delete').tap(function(){
	  $(this).parent('li').remove()
	})
	</script>
#<div id="AJAX">AJAX</div>
***
##<div id="$.ajax">$.ajax</div>
*	$.ajax(options)   ⇒ XMLHttpRequest

执行Ajax请求。它可以是本地资源，或者通过支持HTTP access control的浏览器 或者通过 JSONP来实现跨域。

选项:

*	type(默认： “GET”)：请求方法 (“GET”, “POST”, or other)
*	url (默认： 当前地址)：发送请求的地址
*	data (默认：none)：发送到服务器的数据；如果是GET请求，它会自动被作为参数拼接到url上。非String对象将通过$.param 得到序列化字符串。
*	processData (默认： true)： 对于非Get请求。是否自动将 data 转换为字符串。
*	contentType (默认： “application/x-www-form-urlencoded”)： 发送信息至服务器时内容编码类型。 (这也可以通过设置 headers)。通过设置 false 跳过设置默认值。
*	mimeType (默认： none): 覆盖响应的MIME类型。 
*	dataType (默认： none)：预期服务器返回的数据类型(“json”, “jsonp”, “xml”, “html”, or “text”)
*	jsonp (默认：“callback”): JSONP回调查询参数的名称
*	jsonpCallback (默认： “jsonp{N}”): 全局JSONP回调函数的 字符串（或返回的一个函数）名。设置该项能启用浏览器的缓存。 
*	timeout (默认： 0): 以毫秒为单位的请求超时时间, 0 表示不超时。
*	headers: Ajax请求中额外的HTTP信息头对象
*	async (默认：true): 默认设置下，所有请求均为异步。如果需发送同步请求，请将此设置为 false。
*	global (默认：true): 请求将触发全局Ajax事件处理程序，设置为 false 将不会触发全局 Ajax 事件。
*	context (默认：window): 这个对象用于设置Ajax相关回调函数的上下文(this指向)。
*	traditional (默认： false): 激活传统的方式通过$.param来得到序列化的 data。
*	cache (默认： true): 浏览器是否应该被允许缓存GET响应。从v1.1.4开始，当dataType选项为 "script" 或 *	jsonp时，默认为false。
*	xhrFields (默认： none): 一个对象包含的属性被逐字复制到XMLHttpRequest的实例。 
*	username & password (默认： none): HTTP基本身份验证凭据。
 
如果URL中含有 =?或者dataType是“jsonp”，这请求将会通过注入一个 script标签来代替使用 XMLHttpRequest (查看 JSONP)。此时 contentType, dataType, headers有限制，async 不被支持。

##Ajax 回调函数
你可以指定以下的回调函数，他们将按给定的顺序执行：

*	beforeSend(xhr, settings)：请求发出前调用，它接收xhr对象和settings作为参数对象。如果它返回 false ，请求将被取消。

*	success(data, status, xhr)：请求成功之后调用。传入返回后的数据，以及包含成功代码的字符串。

*	error(xhr, errorType, error)：请求出错时调用。 (超时，解析错误，或者状态码不在HTTP 2xx)。

*	complete(xhr, status)：请求完成时调用，无论请求失败或成功。

##Ajax 事件
当global: true时。在Ajax请求生命周期内，以下这些事件将被触发。

*	ajaxStart (global)：如果没有其他Ajax请求当前活跃将会被触发。

*	ajaxBeforeSend (data: xhr, options)：再发送请求前，可以被取消。

*	ajaxSend (data: xhr, options)：像 ajaxBeforeSend，但不能取消。

*	ajaxSuccess (data: xhr, options, data)：当返回成功时。

*	ajaxError (data: xhr, options, error)：当有错误时。

*	ajaxComplete (data: xhr, options)：请求已经完成后，无论请求是成功或者失败。

*	ajaxStop (global)：如果这是最后一个活跃着的Ajax请求，将会被触发。

默认情况下，Ajax事件在document对象上触发。然而，如果请求的 context 是一个DOM节点，该事件会在此节点上触发然后再DOM中冒泡。唯一的例外是 ajaxStart & ajaxStop这两个全局事件。

	$(document).on('ajaxBeforeSend', function(e, xhr, options){
	  // This gets fired for every Ajax request performed on the page.
	  // The xhr object and $.ajax() options are available for editing.
	  // Return false to cancel this request.
	})
	
	$.ajax({
	  type: 'GET',
	  url: '/projects',
	  // data to be added to query string:
	  data: { name: 'Dom' },
	  // type of data we are expecting in return:
	  dataType: 'json',
	  timeout: 300,
	  context: $('body'),
	  success: function(data){
	    // Supposing this JSON payload was received:
	    //   {"project": {"id": 42, "html": "<div>..." }}
	    // append the HTML to context object.
	    this.append(data.project.html)
	  },
	  error: function(xhr, type){
	    alert('Ajax error!')
	  }
	})
	
	// post a JSON payload:
	$.ajax({
	  type: 'POST',
	  url: '/projects',
	  // post payload:
	  data: JSON.stringify({ name: 'Dom' }),
	  contentType: 'application/json'
	})


##<div id="$.get">$.get</div>
*	$.get(url, function(data, status, xhr){ ... })   ⇒ XMLHttpRequest

执行一个Ajax GET请求。这是一个 $.ajax的简写方式。

	$.get('/whatevs.html', function(response){
	  $(document.body).append(response)
	})


##<div id="$.getJSON">$.getJSON</div>
*	$.getJSON(url, function(data, status, xhr){ ... })   ⇒ XMLHttpRequest

通过 Ajax GET请求获取JSON数据。这是一个 $.ajax 的简写方式。

	$.getJSON('/awesome.json', function(data){
	  console.log(data)
	})
	
	// fetch data from another domain with JSONP
	$.getJSON('//example.com/awesome.json?callback=?', function(remoteData){
	  console.log(remoteData)
	})


##<div id="$.param">$.param</div>
*	$.param(object, [shallow])   ⇒ string
*	$.param(array)   ⇒ string

序列化一个对象，在Ajax请求中提交的数据使用URL编码的查询字符串表示形式。如果shallow设置为true。嵌套对象不会被序列化，嵌套数组的值不会使用放括号在他们的key上。

如果任何对象的某个属性值是一个函数，而不是一个字符串，该函数将被调用并且返回值后才会被序列化。

此外，还接受 serializeArray格式的数组，其中每个项都有 “name” 和 “value”属性。

	$.param({ foo: { one: 1, two: 2 }})
	//=> "foo[one]=1&foo[two]=2)"
	
	$.param({ ids: [1,2,3] })
	//=> "ids[]=1&ids[]=2&ids[]=3"
	
	$.param({ ids: [1,2,3] }, true)
	//=> "ids=1&ids=2&ids=3"
	
	$.param({ foo: 'bar', nested: { will: 'not be ignored' }})
	//=> "foo=bar&nested[will]=not+be+ignored"
	
	$.param({ foo: 'bar', nested: { will: 'be ignored' }}, true)
	//=> "foo=bar&nested=[object+Object]"
	
	$.param({ id: function(){ return 1 + 2 } })
	//=> "id=3"


##<div id="$.post">$.post</div>
*	$.post(url, [data], function(data, status, xhr){ ... }, [dataType])   ⇒ XMLHttpRequest

执行Ajax POST请求。这是一个 $.ajax 的简写方式。

	$.post('/create', { sample: 'payload' }, function(response){
	  // process response
	})
	data 参数可以是一个字符串：
	
	$.post('/create', $('#some_form').serialize(), function(response){
	  // ...
	})

