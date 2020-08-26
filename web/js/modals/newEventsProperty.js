
/**
 * 用于处理事件中的 属性数据。属性查询 属性处理 属性渲染配置
 */
function newEventsProperty() {
    this.NAME_SPACE = ".EVENTSPROPERTY"
    this.$events = $("#events_modal")
    this.operationOptions = [{
        name: "值不变",
        value: "origin"
    },
    {
        name: "起始值",
        value: "start"
    },
    {
        name: "终止值",
        value: "end"
    },
    {
        name: "数据格式转换",
        value: "dataSwitch"
    }]
    this.NumberType = [{
        name: "自然数",
        value: "dayTime"
    },
    {
        name: "数字",
        value: "number"
    },
    {
        name: "字母",
        value: "letter"
    }]
    this.dataSwitchConfigure = [{
        name: "时间格式转换",
        value: "timeSwitch"
    }, {
        name: "其它格式",
        value: "otherSwitch"
    }
    ]
    this.computerDirection = [{
        name: "起始列-->终止列",
        value: "startCloToEndCol"
    }, {
        name: "终止列-->起始列",
        value: "EndColToStartCol"
    }, {
        name: "起始行-->终止行",
        value: "startRowToEndRow"
    }, {
        name: "终止行-->起始行",
        value: "endRowToStartRow"
    }]
    this.renderType = [{
        name: "数字累加",
        value: "numberAdd"
    }, {
        name: "文字累加",
        value: "charactersAdd"
    }, {
        name: '字母累加',
        value: 'letterAdd'
    }, {
        name: '替换',
        value: 'stringReplace'
    }]


    /**
     * 
     * @param {*} defaultOption //默认下来列表选线
     * @param {*} options //选项
     * @param {*} selectedValue //选中值
     * @param {*} isPrompt //是否带选中值
     * @param {*} SelectClass //下来列表的class
     * @param {*} isAppend //是否添加到
     * @param {*} appendTo //添加到
     */
    this._renderSelect = function (defaultOption, options, selectedValue, isPrompt, selectClass, attr, isAppend, appendTo) {
        if (!Array.isArray(options)) {
            options = []
        }
        isPrompt = !!isPrompt;
        isAppend = !!isAppend;
        var data = Array.prototype.slice.call(options, 0);
        if (defaultOption) {
            if (DataType.isObject(defaultOption)) {
                data.unshift(defaultOption)
            } else if (DataType.isArray(defaultOption)) {
                defaultOption.forEach(ele => {
                    if (DataType.isObject(ele)) data.unshift(ele);
                })
            }
        }
        var html = `<select class="${selectClass}" data-selected="${selectedValue}">`;
        data.forEach(item => {
            var value = item.value,
                prompt = "",
                selected = "";
            if (isPrompt && value || isPrompt && value === 0) {
                // prompt = `(${value})`
                prompt = value;
            }
            if (value == selectedValue) {
                selected = "selected"
            }
            // html += `<option value="${value}" data-text="${item.name}" ${selected}>${item.name}${prompt}</option>`
            html += `<option value="${value}" data-text="${item.name}" title="${value}" ${selected}>${item.name}</option>`
        });
        html += `</select>`;
        var $select = $(html);
        $select.attr(attr);
        isAppend && appendTo($select.get(0).outerHTML);
        return $select.get(0).outerHTML
    }
    //渲染经过属性处理后的数据
    this._renderQueryHandleSelect = function (defaultOption, options, selectedValue, isPrompt, selectClass, attr, isAdd, att) {
        if (!Array.isArray(options)) {
            options = []
        }
        var html = `<select class="${selectClass}" >`;
        if (defaultOption) {
            if (DataType.isObject(defaultOption)) {
                html += `<option data-text="${defaultOption.name}" value="${defaultOption.value}" title="${defaultOption.value}" ${selectedValue == defaultOption.value ? "selected" : ""}>${defaultOption.name}</option>`;
            } else if (DataType.isArray(defaultOption)) {
                for (var item = defaultOption.length - 1; item >= 0; item--) {
                    var defaultItem = defaultOption[item];
                    html += `<option data-text="${defaultItem.name}" value="${defaultItem.value}" title="${defaultItem.value}" ${selectedValue == defaultItem.value ? "selected" : ""}>${defaultItem.name}</option>`;
                }
            }
        }
        options.forEach(item => {
            if (DataType.isObject(item)) {
                html += `<option data-text="${item.name}" value="${item.value}" title="${item.value}" ${selectedValue == item.value ? "selected" : ""}>${item.name}</option>`
            } else {
                item.forEach(itemVal => {
                    // if(att=="XAxis")
                    var regex = /\((.+?)\)/g,
                        matchText = itemVal.name.match(regex),
                        value = matchText ? matchText[0].substr(1, matchText[0].length - 2) : itemVal.name,
                        itemValue = att == "XAxis" && value == "y" || att == "Yaxis" && value == "x" ? itemVal.value : itemVal.name;
                    html += isAdd ? `<option data-text="${itemVal.name}" value="${itemValue}" ${selectedValue == itemValue ? "selected" : ""}>${itemVal.name}</option>` : `<option data-text="${itemVal.name}" value="${itemVal.name}"  ${selectedValue == itemVal.name ? "selected" : ""}>${itemVal.name}</option>`
                })
            }
        });
        html += `</select>`;
        var $select = $(html);
        $select.attr(attr);
        return $select.get(0).outerHTML;
    }
    this._renderFieldsCheckBox = function (fields, selectFields, variable) {
        var data = [],
            str = "";
        if (!selectFields) selectFields = [];
        selectFields.forEach(item => {
            data.push(item.value);
        })
        if (!fields) fields = [];
        fields.forEach(function (item) {
            if (variable && variable.substr(5, 1) === "C") {
                item.forEach(itemVal => {
                    str += `<label class="checkbox-inline"><input type="checkbox" name="${itemVal.name}" ${data.includes(itemVal.name) ? "checked" : ""} value="${itemVal.name}">${itemVal.name}</label>`;
                })
            } else {
                str += `<label class="checkbox-inline"><input type="checkbox" name="${item.name}" ${data.includes(item.value) ? "checked" : ""} value="${item.value}">${item.name}${item.value.includes("'") ? "" : "(" + item.value + ")"}</label>`;
            }
        });
        return str;
    }
    this._renderQueryCondition = function (dbName, tableName, conditions, variable) {
        var that = this,
            str = "";
        str = `<table class="table table-bordered">
                    <thead>
                        <tr>
                            <th class="text-center">字段</th>
                            <th class="text-center">操作符</th>
                            <th class="text-center">数据类型</th>
                            <th class="text-center">数据</th>
                            <th><span class="add" data-add="renderCopySendCondition">＋</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        ${that._renderConditionTr(dbName, tableName, conditions, variable)}
                    </tbody>
               </table>`
        return str;
    }
    //渲染查询的条件
    this._renderConditionTr = function (dbName, table, conditions, variable) {
        var that = this,
            str = "";
        if (!Array.isArray(conditions)) return str;
        conditions.forEach(item => {
            str += `<tr class="tr copySendCondition">
                        <td>
                           ${that._renderConditionFields(dbName, table, item.field, variable)}
                        </td>
                        <td>
                            ${that._renderQueryOpearation(item.operator, "operator")}       
                        </td>
                        <td>
                           ${that._renderQueryType(item.type)}
                        </td>
                        <td style="width:260px">                        
                            <table>
                                <tr>
                                    <td>
                                        <input type="text" data-category="copySend_conditions" data-wrap="true" data-save="condition_value" class="form-control" value='${item.value || ""}'>
                                    </td>
                                    <td>
                                    ${that._renderQueryOpearation(item.datetype ? item.datetype : "", "dateConfig")}
                                    </td>
                                </tr>
                            </table>
                        </td>
                        <td>
                            <span class="del">×</span>
                        </td>
                    </tr>`
        })
        // 
        return str;
    }

    //渲染属性查询的Tr
    this._renderPropertyDataTr = function (propertyDatas, trIndex) {
        var that = this,
            str = "";

        if (!Array.isArray(propertyDatas)) return str;
        propertyDatas.forEach((propertyData, index) => {
            var propertyData = propertyData ? propertyData : {},
                cname = propertyData ? propertyData.cname : "",
                variable = propertyData ? propertyData.variable : "",
                dbName = propertyData.query ? propertyData.query.dbName : "",
                tableName = propertyData.query ? propertyData.query.table : "",
                conditions = propertyData.query ? propertyData.query.conditions : [],
                fields = propertyData.query ? propertyData.query.fields : [];
            trIndex = trIndex ? trIndex : index
            str += `<tr class="tr propertyDataTr" index="${trIndex}">
                <td><input type="text" data-save="cname" data-variable="${variable ? variable : ''}" class="form-control" value="${cname ? cname : ''}"></td>
                <td>${that._renderDbNameSelect(dbName)}</td>
                <td>${that._renderTableNameSelect(dbName, tableName)}</td>
                <td>${that._renderQueryCondition(dbName, tableName, conditions)}</td>
                <td class="queryFields checkboxField">${that._renderQueryFields(dbName, tableName, fields)}</td>
                <td><span class="del">×</span></td>
                </tr>`
        })
        return str;
    }
    //渲染属性查询的Tr
    this._renderPropertyQueryTr = function (propertyQuerys) {
        var that = this,
            str = "";
        if (!Array.isArray(propertyQuerys)) {
            return str
        }
        propertyQuerys.forEach(propertyQuery => {
            var variable = propertyQuery ? propertyQuery.oldVariable : "",
                cname = propertyQuery ? propertyQuery.cname : "",
                selectFields = propertyQuery ? propertyQuery.fields : [],
                dbName = propertyQuery.query ? propertyQuery.query.dbName : [],
                tableName = propertyQuery.query ? propertyQuery.query.tableName : [],
                conditions = propertyQuery.query ? propertyQuery.query.conditions : [];
            str += `<tr class="propertyQueryTr">
                    <td><input type="text" class="form-control" data-save="cname" value="${cname ? cname : ""}"  /></td>
                    <td>${that._renderCustomVariable(variable)}</td>
                    <td>${that._renderQueryCondition(dbName, tableName, conditions, variable)}</td>
                    <td class="propertyQueryFields">${that._renderPropertyQueryFields(variable, selectFields)}</td>
                    <td class="text-center"><span class="del">×</span></td>
                </tr>`
        })
        return str;
    }
    //渲染变量文件
    this._renderCustomVariable = function (selectedValue, isLine) {
        var that = this,
            defaultOption = {
                name: "请选择变量文件",
                value: ""
            },
            options = [],
            selectedValue = selectedValue,
            isPrompt = true,
            selectClass = "from-control chosen",
            attr = {
                "data-save": "variable",
                "data-change": "variable"
            }
        if (isLine == "isline") {
            defaultOption.name = "请选择表头变量"
            attr = {
                "data-save": "XVariable",
                "data-change": "XVariable"
            };
        }
        if (isLine == "cacheVariable") {
            attr = {
                "data-save": "cacheVariable",
                "data-change": "cacheVariable"
            }
        }
        if (isLine == "handleSelectVariable") {
            attr = {
                "data-save": "handleSelectVariable",
                "data-change": "handleSelectVariable"
            }
        }
        GLOBAL_PROPERTY.BODY && GLOBAL_PROPERTY.BODY.customVariable && GLOBAL_PROPERTY.BODY.customVariable.forEach(function (item) {
            var option = {
                name: item.cname ? item.cname : item.key,
                value: item.key
            }
            options.push(option)
        })
        return that._renderSelect(defaultOption, options, selectedValue, isPrompt, selectClass, attr)
    }
    this._renderXVariable = function (selectedValue) {
        var that = this,
            defaultOption = {
                name: "请选择自定义变量",
                value: ""
            },
            options = [],
            selectedValue = selectedValue,
            isPrompt = true,
            selectClass = "from-control chosen",
            attr = {
                "data-save": "XVariable",
                "data-change": "XVariable"
            };
        GLOBAL_PROPERTY.BODY && GLOBAL_PROPERTY.BODY.extendHead && GLOBAL_PROPERTY.BODY.extendHead.forEach(function (item) {
            var option = {
                name: item.cname ? item.cname : item.key,
                value: item.key
            }
            options.push(option)
        })
        return that._renderSelect(defaultOption, options, selectedValue, isPrompt, selectClass, attr)
    }
    //渲染数据库下拉列表
    this._renderDbNameSelect = function (selectedValue) {
        var that = this,
            defaultOption = {
                name: "请选择数据库",
                value: ""
            },
            options = new BuildTableJson().getOptions(AllDbName, "dbName", {}),
            selectedValue = selectedValue,
            isPrompt = false,
            selectClass = "from-control chosen",
            attr = {
                "data-save": "dbName",
                "data-change": "dbName"
            };
        return that._renderSelect(defaultOption, options, selectedValue, isPrompt, selectClass, attr)
    }
    //渲染表下拉列表
    this._renderTableNameSelect = function (dbName, selectedValue) {
        var that = this,
            defaultOption = {
                name: "请选择数据表",
                value: ""
            },
            options = new BuildTableJson().getOptions(AllDbName, "table", {
                dbName: dbName
            }),
            selectedValue = selectedValue,
            isPrompt = true,
            selectClass = "from-control chosen",
            attr = {
                "data-save": "table",
                "data-change": "table"
            };
        return that._renderSelect(defaultOption, options, selectedValue, isPrompt, selectClass, attr)

    }
    //渲染字段下拉列表
    this._renderConditionFields = function (dbName, tableName, selectField, variable) {
        var that = this,
            defaultOption = {
                name: "请选择列",
                value: ""
            };
        var options = "";
        var ishandleSelect = true;
        selectedValue = selectField,
            isPrompt = true,
            selectClass = "from-control chosen",
            attr = {
                "data-save": "field",
                "data-change": "field"
            };
        if (dbName && tableName) {
            options = new BuildTableJson().getOptions(AllDbName, "field", {
                dbName: dbName,
                table: tableName
            })
        } else {
            GLOBAL_PROPERTY.BODY && GLOBAL_PROPERTY.BODY.customVariable && GLOBAL_PROPERTY.BODY.customVariable.forEach(function (item) {
                if (variable == item.key) {
                    if (item.fields) {
                        options = item.fields;
                        ishandleSelect = true;
                    } else {
                        options = item.handleResult;
                        ishandleSelect = false;
                    }
                }
            })
        }
        return ishandleSelect ? that._renderSelect(defaultOption, options, selectedValue, isPrompt, selectClass, attr) : that._renderQueryHandleSelect(defaultOption, options, selectedValue, isPrompt, selectClass, attr, false);
    }
    //渲染查询操作符
    this._renderQueryOpearation = function (selectedValue, type) {
        var that = this,
            defaultOption = {
                name: "选择",
                value: ""
            },
            selectedValue = selectedValue,
            isPrompt = false,
            selectClass = "from-control chosen",
            options = '',
            attr = ','
        if (type == "dateConfig") {
            options = ConditionsHelper.dateConfig;
            attr = {
                "data-save": "condition_datetype",
                "data-change": "condition_datetype"
            };
        } else if (type == "operator") {
            options = ConditionsHelper.getOperators(1);
            attr = {
                "data-save": "condition_operator",
                "data-change": "condition_operator"
            };
        }
        return that._renderSelect(defaultOption, options, selectedValue, isPrompt, selectClass, attr)

    }
    //渲染查询的数据类型
    this._renderQueryType = function (selectedValue) {
        var that = this,
            defaultOption = "",
            options = ConditionsHelper.copySendConfig,
            selectedValue = selectedValue,
            isPrompt = false,
            selectClass = "from-control chosen",
            attr = {
                "data-save": "condition_type",
                "data-change": "condition_type"
            };
        return that._renderSelect(defaultOption, options, selectedValue, isPrompt, selectClass, attr)
    }
    //渲染查询字段的选择字段
    this._renderQueryFields = function (dbName, tableName, selectFields) {
        var that = this,
            fields = new BuildTableJson().getOptions(AllDbName, "field", {
                dbName: dbName,
                table: tableName
            });
        return that._renderFieldsCheckBox(fields, selectFields)
    }
    //获取查询属性
    this._getQueryCondition = function ($conditions) {
        var conditions = [];
        $conditions.each(function () {
            var condition = {};
            condition.field = $(this).find('[data-save="field"]').val();
            condition.operator = $(this).find('[data-save="condition_operator"]').val();
            condition.type = $(this).find('[data-save="condition_type"]').val();
            condition.value = $(this).find('[data-save="condition_value"]').val();
            condition.datetype = $(this).find('[data-save="condition_datetype"]').val();
            conditions.push(condition)
        })
        return conditions
    }
    //获取字段
    this._getFields = function ($target) {
        var result = [];
        $target.find("input:checked").each(function () {
            var obj = {
                name: $(this).attr('name'),
                value: $(this).val()
            }
            result.push(obj)
        })
        return result;
    }
    //渲染属性查询的字段
    this._renderPropertyQueryFields = function (variable, selectFields) {
        var that = this,
            fields = [],
            propertyData = "";

        GLOBAL_PROPERTY.BODY && GLOBAL_PROPERTY.BODY.customVariable && GLOBAL_PROPERTY.BODY.customVariable.forEach(function (item, index) {
            if (item.key == variable) {
                variable.substr(5, 1) !== "C" ? fields = item.fields : fields = item.handleResult;
            }
        })
        // if (!DataType.isObject(propertyData)) {
        //     return "";
        //     // return alert(`请先配置自定义变量${variable}的属性数据`)
        // }
        // var dbName = propertyData.dbName,
        //     tableName = propertyData.table,
        //     propertyDataFields = propertyData.fields,
        //     tableFields = new BuildTableJson().getOptions(AllDbName, "field", {
        //         dbName: dbName,
        //         table: tableName
        //     }),
        //     fields = [];
        // tableFields.forEach(function (item) {
        //     if (propertyDataFields.includes(item.value)) {
        //         fields.push(item)
        //     }
        // })

        return that._renderFieldsCheckBox(fields, selectFields, variable)

    }
    //渲染数据处理的表
    // this._renderPropertyHandleTr = function (propertyHandle) {
    //     var that = this,
    //         str = `<table class="table table-bordered">
    //                     <thead>
    //                         <tr>
    //                             <th class="text-center">字段</th>
    //                             <th class="text-center">操作类型</th>
    //                             <th class="text-center">数值类型</th>
    //                             <th class="text-center">数据格式转换配置</th>
    //                             <th class="text-center">数据配置</th>
    //                         </tr>
    //                     </thead>
    //                 <tbody>`;
    //     propertyHandle.forEach(item => {
    //         str += `<tr class="propertyHandleConfig">
    //                     <td><input type="text" class="form-control" data-save="field" disabled="disabled" value="${item.field}"></td>
    //                     <td>${that._renderPropertyHandleOperation(item.operation)}</td>
    //                     <td>
    //                         ${that._renderPropertyHandleType(item.type)}
    //                     </td>
    //                     <td>
    //                         ${that._renderPropertyHandleSwitch(item.switch, item.operation)}
    //                     </td>
    //                     <td class="propertyHandleOtherConfig">
    //                         ${that._renderPropertyConfig(item.otherConfig, item.switch)}
    //                     </td>
    //                 </tr>`
    //     })
    //     str += "</tbody></table>";
    // }
    //渲染属性处理的操作类型
    this._renderPropertyHandleOperation = function (selectedValue) {
        var that = this,
            defaultOption = {
                name: "请选择操作类型",
                value: ""
            },
            options = that.operationOptions,
            selectedValue = selectedValue,
            isPrompt = true,
            selectClass = "form-control chosen",
            attr = {
                "data-save": "operation",
                "data-change": "operation"
            };

        return that._renderSelect(defaultOption, options, selectedValue, isPrompt, selectClass, attr)
    }
    //渲染属性处理的值类型
    this._renderPropertyHandleType = function (selectedValue) {
        var that = this,
            defaultOption = {
                name: "请选择值类型",
                value: ""
            },
            options = that.NumberType,
            selectedValue = selectedValue,
            isPrompt = true,
            selectClass = "form-control chosen",
            attr = {
                "data-save": "type",
                "data-change": "type",
                "data-propertyHandleChange": "propertyHandle"
            };
        return that._renderSelect(defaultOption, options, selectedValue, isPrompt, selectClass, attr)
    }
    //item.config 
    this._renderPropertyConfig = function (config, type) {
        var str = "";
        if (type == "timeSwitch") {
            str = `
                <span>开始</span><input type="text" class="form-control" data-change="allDayStart" value="${config.allDayStart ? config.allDayStart : ""}" data-save="allDayStart"/>
                <span>半天当天开始</span><input type="text" class="form-control"  data-change="halfDayStart" value="${config.halfDayStart ? config.halfDayStart : ""}" data-save="halfDayStart"/>
                <span>半天次日开始</span><input type="text" class="form-control" disabled="disabled" data-change="nextHalfDayStart" value="${config.nextHalfDayStart ? config.nextHalfDayStart : ""}" data-save="nextHalfDayStart"/>
                <span>当天结束</span><input type="text" class="form-control" data-change="allDayEnd" data-save="allDayEnd" value="${config.allDayEnd ? config.allDayEnd : ""}"/>
                <span>半天当日结束</span><input type="text" class="form-control" disabled="disabled" data-change="halfDayEnd" data-save="halfDayEnd" value="${config.halfDayEnd ? config.halfDayEnd : ""}"/>
                <span>次日结束</span><input type="text" class="form-control" data-change="nextAllDayEnd" data-save="nextAllDayEnd" value="${config.nextAllDayEnd ? config.nextAllDayEnd : ""}"/>
                <span>半天次日结束</span><input type="text" class="form-control" disabled="disabled" data-change="nextHalfDayEnd" data-save="nextHalfDayEnd" value="${config.nextHalfDayEnd ? config.nextHalfDayEnd : ""}"/>
                <span>无字符</span><input type="text" class="form-control" disabled="disabled" data-change="noCharacter" data-save="noCharacter" value="${config.noCharacter ? config.noCharacter : ""}"/>
                `
        }

        return str;
    }
    //渲染属性处理的数据格式转换配置
    this._renderPropertyHandleSwitch = function (selectedValue, type) {
        var that = this,
            defaultOption = {
                name: "请选择操作类型",
                value: ""
            },
            options = that.dataSwitchConfigure,
            selectedValue = selectedValue,
            isPrompt = true,
            selectClass = "form-control chosen",
            attr = {
                "data-save": "switch",
                "data-change": "switch",

            };
        if (type != "dataSwitch") {
            attr.disabled = "disabled"
        }

        return that._renderSelect(defaultOption, options, selectedValue, isPrompt, selectClass, attr)
    }
    this._renderPropertyRenderTr = function (propertyRenders) {
        var that = this,
            str = "";
        if (!Array.isArray(propertyRenders)) {
            // console.log($(".propertyRenderTbody"))
            // console.log(JSON.stringify(propertyRenders))
            // $(".propertyRenderTbody").attr("propertyRendersData", JSON.stringify(propertyRenders));//暂时作为tbody的属性
            return str;
        }
        propertyRenders.forEach(propertyRender => {
            str += `<tr class="propertyRenderTr">
                                <td class="text-center"><span class="del">×</span></td>
                                <td>${that._renderCustomVariable(propertyRender.variable || "")}</td>
                                <td>${that._renderCustomVariable(propertyRender.XVariable || '', "isline")}</td>
                                <td class="xlineTD">${that._renderPropertyRenderFields(propertyRender.XVariable, propertyRender.Xline, true, "extrLine")}</td>
                                <td>${that._renderPropertyRenderFields(propertyRender.variable, propertyRender.Xaxis, true, "keyWord")}</td>
                                <td>${that._renderPropertyRenderYaxis(propertyRender.variable, propertyRender.Yaxis)}</td>
                                <td>${that._renderPropertyRenderType(propertyRender.renderType)}</td>
                                <td class="positoonTD">${that._renderPropertyRenderFields(propertyRender.XVariable, propertyRender.renderPositoon, true, "renderPositoon")}</td>
                                <td>
                                    <div style = "position:relative">
                                        <input type="text" class="form-control render-color" save-type="style" data-save="color" value="${ propertyRender.renderColor || ""}">
                                        <div class="property-icon-wrap" style="top:2px">
                                            <input type="color" data-belong="render-color" class="property-color-input">
                                        <i class="icon icon-color"></i>
                                    </div>
                                </td>
                                <td>
                                    <input type="text" class="form-control" data-save="colWidth" value="${propertyRender.ColWisth || ''}">
                                </td>
                            </tr>`
            // str += `<tr class="propertyRenderTr">
            //                 <td class="text-center"><span class="del">×</span></td>
            //                 <td>${that._renderCustomVariable(propertyRender.variable || "")}</td>
            //                 <td>${that._renderCustomVariable(propertyRender.XVariable || '', "isline")}</td>
            //                 <td class="xlineTD">${that._renderPropertyRenderFields(propertyRender.XVariable, propertyRender.Xline, true, "extrLine")}</td>
            //                 <td>${that._renderPropertyRenderFields(propertyRender.variable, propertyRender.Xaxis, true)}</td>
            //                 <td>${that._renderPropertyRenderYaxis(propertyRender.variable, propertyRender.Yaxis)}</td>
            //                 <td>${that._renderPropertyRenderType(propertyRender.renderType)}</td>
            //                 <td><input type="text" class="form-control" data-save="renderPositoon" value="${propertyRender.renderPositoon || ''}"></td>
            //                 <td>
            //                     <div style = "position:relative">
            //                         <input type="text" class="form-control render-color" save-type="style" data-save="color" value="${ propertyRender.renderColor || ""}">
            //                         <div class="property-icon-wrap" style="top:2px">
            //                             <input type="color" data-belong="render-color" class="property-color-input">
            //                         <i class="icon icon-color"></i>
            //                     </div>
            //                 </td>
            //                 <td>
            //                     <input type="text" class="form-control" data-save="colWidth" value="${propertyRender.ColWisth || ''}">
            //                 </td>
            //             </tr>`
        })
        return str;
    }
    this.renderExtendColTr = function (extendCol = { tableHead: [], extendHead: [] }) {
        // if (extendCol == null) {
        //     extendCol = { tableHead: [], extendHead: [] }
        // }
        if (!extendCol.length) extendCol = [{ tableHead: [], extendHead: [] }];

        var that = this,
            str = "";
        extendCol.forEach(ele => {
            str += `<tr class="extendColTr">
                    <td class="text-center"><span class="del">×</span></td>
                    <td><input type="text" class="form-control" data-save="cname" value="${ele.cname || ''}" /></td>
                    <td>${that._renderCustomVariable(ele.oldVariable || "")}</td>
                    <td>
                        ${this._renderHead(ele.tableHead)}
                    </td>
                    <td>
                        <input type="text" class="form-control" data-category="startInpt" data-save="startText" value="${ele.startText || ""}" >
                    </td>
                    <td>
                        <input type="text" class="form-control" data-category="endInpt" data-save="endText" value="${ele.endText || ""}" >
                    </td>
                    <td>
                        <input type="text" class="form-control"  data-save="startSubstr" value="${ele.startSubstr || ""}" >
                    </td>
                    <td>
                        <input type="text" class="form-control"  data-save="endSubstr" value="${ele.endSubstr || ""}" >
                    </td>
                    <td>
                        <input type="text" class="form-control" data-save="fieldSplit" value="${ele.fieldSplit || ''}"/>
                    </td>
                    <td>
                        <input type="text" class="form-control" data-save="splitMark" value="${ele.splitMark || ''}"/>
                    </td>
                    <td>
                        ${ele.extendHead ? this._renderExtendHead(ele.extendHead) : ''}
                    </td>
                </tr>`
        })
        return str;
    }
    this._renderExtendHead = function (extendhedes) {
        var that = this,
            str = `<table class="table table-bordered extendHeads" style="margin-bottom:0px">
            <thead>
                <tr>
                    <th class="text-center">表头列</th>
                    <th class="text-center">中文名</th>
                    <th class="text-center">表头英文名</th>
                </tr>
            </thead>
            <tbody>
                ${that.renderExtendHeadTr(extendhedes)}
            </tbody>
        </table>`;
        return str;
    }
    this.renderExtendHeadTr = function (extendhedes) {
        var that = this,
            str = ""
        arr = [1, 2, 3, 4, 5, 6];
        arr.forEach(function (item, index) {
            str += `<tr>
                    <td><input type="text" class="form-control" data-save="sortLine" disabled value="${index + 1}"></td>
                    <td><input type="text" class="form-control" data-save="name" value="${extendhedes && extendhedes[index] ? (extendhedes[index].name || '') : ''}"></td>
                    <td><input type="text" class="form-control" data-save="value" value="${extendhedes && extendhedes[index] ? (extendhedes[index].value || '') : ""}"></td>
                </tr>`
        })
        return str;
    }
    this._renderHead = function (heads) {
        var that = this,
            str = `<table class="table table-bordered tableHead" style="margin-bottom:0px" >
                <thead>
                    <tr>
                        <th class="text-center">表头列</th>
                        <th class="text-center">中文名</th>
                        <th class="text-center">表头英文名</th>
                    </tr>
                </thead>
                <tbody>
                    ${that.renderHeadTr(heads)}
                </tbody>
            </table>`
        return str;
    }
    this.renderHeadTr = function (heads = [{}]) {
        var str = "";
        heads.forEach((item, index) => {
            str += `<tr>
                    <td><input type="text" class="form-control" data-save="sortLine" value="${item.sortLine ? item.sortLine : index + 1}"/></td>
                    <td><input type="text" class="form-control" data-save="name" value="${item.name}"/></td>
                    <td><input type="text" class="form-control" data-save="value" disabled value="${item.value}"/></td>
                </tr>`
        })
        return str;
    }

    this._renderPropertyHandleBodYTr = function (propertyhandels) {
        var that = this,
            str = "";
        propertyhandels.forEach(propertyHandle => {
            str += `<tr class="propertyHandleVariable">
                        <td class="text-center" >
                            <span class="del">×</span>
                        </td>
                        <td>
                            ${that._renderSourceConfigure(propertyHandle)}
                        </td>
                        <td>
                            ${that._renderNewbuiltConfigure(propertyHandle)}
                        </td>
                    </tr>`
        })
        return str;
        // propertyhandels.forEach(propertyHandle => {
        //     var variable = propertyHandle ? propertyHandle.oldVariable : "",
        //         cname = propertyHandle ? propertyHandle.cname : "",
        //         handles = propertyHandle ? propertyHandle.handles : [],
        //         Xaxis = propertyHandle ? propertyHandle.Xaxis : "",
        //         Yaxis = propertyHandle ? propertyHandle.Yaxis : [];
        //     str += `<tr class="propertyHandleVariable">
        //                 <td class="text-center" >
        //                     <span class="del">×</span>
        //                 </td>
        //                 <td>
        //                     <input type="text" class="form-control" value="${cname ? cname : ""}" data-save="cname"/>
        //                 </td>
        //                 <td >
        //                     ${that._renderCustomVariable(variable)}
        //                 </td>
        //                 <td >
        //                     ${that._renderPropertyRenderFields(variable, Xaxis, true)} 
        //                 </td>
        //                 <td>
        //                     ${that._renderPropertyHandleYaxis(variable, Yaxis)}
        //                 </td>
        //                 <td>
        //                     ${that._renderPropertyHandleTr(handles)}
        //                 </td>
        //             </tr>`
        // })
        // return str;
    }
    //渲染缓存数据库中的Tr
    this._renderCacheDatabaseTr = function (cacheDatabase) {
        var that = this,
            str = "";
        cacheDatabase.forEach(ele => {
            str += `<tr class="cacheDatabaseTr">
                    <td><span class="del" data-attr="cacheDatabase">×</span></td>
                    <td>${that._renderCacheDatabaseNameLastLine(ele.cname, ele.ename, ele.lastLine)}</td>
                    <td>${that._renderCacheDatabaseFixedFirstLine(ele.variable, ele.fixedFirstLine)}</td>
                    <td>${that._renderCacheDatabaseDynamicLine(ele)}</td>
                    <td>${that._renderCacheDatabaseFixedLastLine(ele.fixedLastLine)}</td>
                  </tr> `;
        })
        return str;
        // ${that._renderCacheDatabaseFixedLastLine(ele.fixedLastLine)}
    }
    //缓存数据库中的缓存数据库名、尾行配置
    this._renderCacheDatabaseNameLastLine = function (cname, ename, lastLine) {
        var that = this,
            $eleSelect = $(".pm-elem3.selected").text() + '_EAA',
            str = `<table class="table table-bordered" style="margin-bottom: 0px;">
                    <thead>
                        <tr>
                            <th class="text-center">中文名</th>
                            <th class="text-center">英文名</th>
                            <th class="text-center">尾行</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><input type="text" class="form-control" value="${cname ? cname : ""}" data-save="cname"></td>
                            <td><input type="text" class="form-control" disabled value="${ename ? ename : $eleSelect}" data-save="ename"></td>
                            <td>${that._renderCacheDatabaseLastLine(lastLine)}</td>
                        </tr>
                    </tbody>
                </table>`;
        return str;
    }
    //尾行
    this._renderCacheDatabaseLastLine = function (lastLine) {
        var that = this,
            str = `<table class="table table-bordered lastLine" style="margin-bottom: 0px;">
                    <thead>
                        <tr>
                            <th class="text-center">尾行备注</th>
                            <th class="text-center">备注范围</th>
                            <th class="text-center"><span class="add" data-add="rendLastLineData">+</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        ${lastLine ? that._rendLastLineData(lastLine) : ""}
                    </tbody>
                </table>`;
        return str;
    }
    //尾行tr
    this._rendLastLineData = function (lastLineItem = [{}]) {
        var str = "";
        lastLineItem.forEach(ele => {
            str += `<tr>
                    <td>
                        <input type="text" class="form-control" value="${ele.remarks ? ele.remarks : ""}" data-save="remarks">
                    </td>
                    <td>
                        <input type="text" class="form-control" value="${ele.range ? ele.range : ""}" data-save="range">
                    </td>
                    <td><span class="del" data-attr="lastLineData">×</span></td>
                  </tr>`;
        })
        return str;
    }
    //缓存数据库中的固定首列配置
    this._renderCacheDatabaseFixedFirstLine = function (variable, fixedFirstLine) {
        var that = this,
            str = `<table class="table table-bordered" style="margin-bottom: 0px;">
                    <thead>
                        <tr>
                            <th class="text-center">加载变量</th>
                            <th class="text-center">排序号</th>
                            <th class="text-center">列中文名</th>
                            <th class="text-center">列英文名</th>
                            <th class="text-center"><span class="add" data-add="renderFixedFirstLineData">+</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>${that._renderCustomVariable(variable || "")}</td>
                            <td colspan="4">
                                <table class="table table-bordered fixedFirstLine" style="margin-bottom: 0px;">
                                    <tbody>${that._renderFixedFirstLineData(fixedFirstLine)}</tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>`;
        return str;
        // ${that._renderCustomVariable(ele.oldVariable || "")}
    }
    //缓存数据库中的固定首列配置中的列数据
    this._renderFixedFirstLineData = function (fixedFirstLine = [{}], $targetLen) {
        var str = "",
            sortLine = $targetLen;
        fixedFirstLine.forEach((ele, index) => {
            sortLine = $targetLen ? sortLine + 1 : index + 1;
            var value = "AAA" + NumberHelper.idToName(sortLine - 1, 1);
            // sortLine = $targetLen && ele.sortLine ? ele.sortLine ? ele.sortLine + $targetLen : index + $targetLen : ele.sortLine ? ele.sortLine : index + 1,
            //     value = $targetLen ? ele.value ? "AAA" + NumberHelper.idToName(ele.value + $targetLen, 1) : "AAA" + NumberHelper.idToName($targetLen, 1) : ele.value ? ele.value : ""
            str += `
                    <tr>
                        <td><input type="text" class="form-control" data-save="sortLine" value="${sortLine}"></td>
                        <td><input type="text" class="form-control" data-save="name" value="${ele.name || ""}"></td>
                        <td><input type="text" class="form-control" data-save="value" disabled value="${value}"></td>
                        <td><span class="del" data-attr="fixedFirstLineData">×</span></td>
                    </tr>
               `;
        })
        return str;
    }
    //缓存数据库中的动态列配置
    this._renderCacheDatabaseDynamicLine = function (dynamicLine) {
        var that = this,
            str = `<table class="table table-bordered" style="margin-bottom: 0px;">
                    <thead>
                        <tr>
                            <th class="text-center">起始值</th>
                            <th class="text-center">终止值</th>
                            <th class="text-center">值截取位</th>
                            <th class="text-center">分段符</th>
                            <th class="text-center">分段数</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><input type="text" class="form-control" data-category="startInpt" data-save="startText" value="${dynamicLine.startText || ""}"></td>
                            <td><input type="text" class="form-control" data-category="endInpt" data-save="endText" value="${dynamicLine.endText || ""}"></td>
                            <td><input type="text" class="form-control" data-save="substr" value="${dynamicLine.substr || ""}"></td>
                            <td><input type="text" class="form-control" data-save="fieldSplit" value="${dynamicLine.fieldSplit || ""}"></td>
                            <td><input type="text" class="form-control" data-save="splitMark" value="${dynamicLine.splitMark || ""}"></td>
                        </tr>
                    </tbody>
                </table>`;
        return str;
    }
    //缓存数据库中的固定尾列配置
    this._renderCacheDatabaseFixedLastLine = function (fixedLastLine) {
        var that = this,
            str = `<table class="table table-bordered fixedLastLine" style="margin-bottom: 0px;">
                <thead>
                    <tr>
                        <th class="text-center">列序</th>
                        <th class="text-center">列中文名</th>
                        <th class="text-center">列英文名</th>
                        <th class="text-center"><span class="add" data-add="renderFixedLastLineData">+</span></th>
                    </tr>
                </thead>
                <tbody>
                    ${fixedLastLine ? that._renderFixedLastLineData(fixedLastLine) : ""}
                </tbody>
            </table>`;
        return str;
    }
    //缓存数据库中的固定尾列配置中tr
    this._renderFixedLastLineData = function (fixedLastLine = [{}]) {
        var str = "";
        fixedLastLine.forEach(ele => {
            str += `<tr>
                        <td><input type="text" class="form-control" data-save="sortLine" disabled value="${ele.sortLine || ""}"></td>
                        <td><input type="text" class="form-control" data-save="name" value="${ele.name || ""}"></td>
                        <td><input type="text" class="form-control" data-save="value" disabled value="${ele.value || ""}"></td>
                        <td><span class="del" data-attr="fixedLastLineData">×</span></td>
                    </tr>`;
        })
        return str;
    }

    //渲染属性渲染中的字段选择问题
    this._renderPropertyRenderFields = function (variable, selectedValue, isXAxis, extrLine) {
        var that = this,
            att = isXAxis ? "XAxis" : "Yaxis",
            defaultOption = '';

        if (extrLine == "keyWord") {
            defaultOption = [{
                name: "主键",
                value: "key"
            }, {
                name: "请选择",
                value: ""
            }]
        } else {
            defaultOption = {
                name: "请选择",
                value: ""
            }
        }
        options = variable ? that._getpropertyRenderXYoption(variable) : [],
            selectedValue = selectedValue,
            isPrompt = true,
            selectClass = "from-control chosen",
            attr = {
                "data-save": att,
                "data-change": att
            };
        if (extrLine == "extrLine") {
            attr = {
                "data-save": 'Xline',
                "data-change": 'Xline'
            }
        } else if (extrLine == "renderPositoon") {
            attr = {
                "data-save": 'renderPositoon'
            }
            options = variable ? that._getpropertyRenderPositoon(variable) : [];
        } else if (extrLine == "cachePosition") {
            attr = {
                "data-save": 'cachePosition'
            }
            defaultOption = null;
            options = variable ? that._getpropertyRenderPositoon(variable) : [];
        }


        return variable ? variable.substr(5, 1) !== "C" ? that._renderSelect(defaultOption, options, selectedValue, isPrompt, selectClass, attr) : that._renderQueryHandleSelect(defaultOption, options, selectedValue, isPrompt, selectClass, attr, true, att) : that._renderSelect(defaultOption, options, selectedValue, isPrompt, selectClass, attr);
        // return that._renderSelect(defaultOption, options, selectedValue, isPrompt, selectClass, attr)
    }
    this._renderPropertyRenderXLine = function (XVariable, selectedValue) {
        var that = this,
            attr = {
                "data-save": "Xline",
                "data-change": "Xline"
            },
            defaultOption = {
                name: "请选择",
                value: ""
            },
            options = XVariable ? that._getXLineoptions(XVariable) : [],
            isPrompt = true,
            selectClass = "from-control chosen";
        return that._renderSelect(defaultOption, options, selectedValue, isPrompt, selectClass, attr)
    }
    this._getXLineoptions = function (XVariable) {
        var options = [], data = [];
        GLOBAL_PROPERTY.BODY && GLOBAL_PROPERTY.BODY.extendHead && GLOBAL_PROPERTY.BODY.extendHead.forEach(item => {
            if (item.key == XVariable) {
                data = item.fields;
            }
        })
        data.forEach(function (item) {
            var option = {
                name: item.cname ? item.cname : item.name,
                value: item.name
            }
            options.push(option)
        })
        return options;
    }
    this._renderPropertyHandleFields = function (variable, selectedValue, attr, options) {
        var that = this,

            defaultOption = {
                name: "请选择",
                value: ""
            },

            selectedValue = selectedValue,
            isPrompt = true,
            selectClass = "from-control chosen";
        if (!options) options = that._getpropertyRenderXYoption(variable);
        return variable ? variable.substr(5, 1) !== "C" ? that._renderSelect(defaultOption, options, selectedValue, isPrompt, selectClass, attr) : that._renderQueryHandleSelect(defaultOption, options, selectedValue, isPrompt, selectClass, attr) : that._renderSelect(defaultOption, options, selectedValue, isPrompt, selectClass, attr);
        // return that._renderSelect(defaultOption, options, selectedValue, isPrompt, selectClass, attr)
    }
    this._getpropertyRenderXYoption = function (variable) {
        var options = [],
            selects = [],
            fields = [],
            data = {};
        GLOBAL_PROPERTY.BODY && GLOBAL_PROPERTY.BODY.customVariable && GLOBAL_PROPERTY.BODY.customVariable.forEach(function (item, index) {
            if (variable == item.key) item.fields ? options = item.fields : options = item.handleResult;
        })
        // var dbName = data.dbName,
        //     table = data.table;
        // selects = data.fields;
        // fields = new BuildTableJson().getOptions(AllDbName, "field", {
        //     dbName: dbName,
        //     table: table
        // });
        // fields.forEach(item => {
        //     if (selects.includes(item.value)) {
        //         options.push(item)
        //     }
        // })
        return options;
    }
    //显示位置
    this._getpropertyRenderPositoon = function (variable) {
        var selectsOptions = [];
        GLOBAL_PROPERTY.BODY && GLOBAL_PROPERTY.BODY.customVariable && GLOBAL_PROPERTY.BODY.customVariable.forEach(function (item, index) {
            if (variable == item.key && item.splitMark) {
                for (let i = 1; i <= Number(item.splitMark); i++) {
                    var num = i - 1;
                    selectsOptions.push({ 'name': num, 'value': num })
                }
            }
        })
        return selectsOptions;
    }
    //属性渲染的渲染类型
    this._renderPropertyRenderType = function (selectedValue) {
        var that = this,
            defaultOption = {
                name: "请选择渲染类型",
                value: ""
            },
            options = [{
                name: '累加',
                value: '0'
            }, {
                name: '替换',
                value: '1'
            }],
            selectedValue = selectedValue,
            isPrompt = false,
            selectClass = "form-control chosen",
            attr = {
                "data-save": "renderType",
                "data-change": "renderType"
            };
        return that._renderSelect(defaultOption, options, selectedValue, isPrompt, selectClass, attr)
    }
    //属性渲染的位置
    this._renderPropertyRenderPostiion = function (selectedValue) {
        var that = this,
            defaultOption = {
                name: "请选择渲染类型",
                value: ""
            },
            options = [{
                name: '累加',
                value: '0'
            }, {
                name: '替换',
                value: '1'
            }],
            selectedValue = selectedValue,
            isPrompt = false,
            selectClass = "form-control chosen",
            attr = {
                "data-save": "renderType",
                "data-change": "renderType"
            };
        return that._renderSelect(defaultOption, options, selectedValue, isPrompt, selectClass, attr)
    }
    //源变量相关配置
    this._renderSourceConfigure = function (propertyHandle) {
        var that = this,
            handles = propertyHandle ? propertyHandle.handles : [],
            variable = propertyHandle ? propertyHandle.oldVariable : "";

        str = `<table class="table table-bordered" style="margin-bottom: 0px;">
                    <thead>
                        <tr>
                            <th class="text-center" ></th>
                            <th class="text-center">数据处理方式<p class="toggle-dot active"></p></th>
                            <th class="text-center">数据格式转换<p class="toggle-dot active"></p></th>
                        </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>${that._renderCustomVariable(variable)}</td>
                        <td style="width:105px">${that._renderSourceHandlesTr(handles)}</td>
                        <td style="width:105px">${that._renderSourceSwitchTr(handles, variable)}</td>
                    </tbody>
                </table>`
        return str;
    }
    //数据处理方式
    this._renderSourceHandlesTr = function (propertyHandle) {
        var that = this,
            str = `<table class="table table-bordered" style="display:none">
                    <thead>
                        <tr>
                            <th class="text-center">字段</th>
                            <th class="text-center">原数据类型</th>
                            <th class="text-center">处理方式</th>
                        </tr>
                    </thead>
                <tbody>`;
        propertyHandle.forEach(item => {
            str += `<tr class="propertyHandleConfig">
                    <td><input type="text" class="form-control" data-save="field" disabled="disabled" value="${item.field}"></td>
                    <td>
                        ${that._renderPropertyHandleType(item.type)}
                    </td>
                    <td>${that._renderPropertyHandleOperation(item.operation)}</td>
                </tr>`
        })
        str += "</tbody></table>";
        return str;
    }
    //数据格式转换
    this._renderSourceSwitchTr = function (propertyHandle, variable) {
        var that = this,

            str = `<table class="table table-bordered" style="display:none">
                    <thead>
                        <tr>
                            <th class="text-center">类别</th>
                            <th class="text-center">配置</th>
                            <th class="text-center">源对应位置</th>
                            <th class="text-center">索引文件</th>
                            <th class="text-center">索引对应位置</th>
                        </tr>
                    </thead>
                <tbody>`;
        propertyHandle.forEach(item => {
            str += `<tr >
                    <td>${that._renderPropertyHandleSwitch(item.switch, item.operation)}</td>
                    <td class="propertyHandleOtherConfig">${that._renderPropertyConfig(item.otherConfig, item.switch)}</td>
                    <td class="propertyHandleSourceRelativePos">${item.switch == "timeSwitch" ? that._renderSourceSwitchTrRelativePos(variable, item.sourceRelativePos, 'source') : ''}</td>
                    <td class="propertyHandleSelectVariable">${item.switch == "timeSwitch" ? that._renderCustomVariable(item.selectVariable, 'handleSelectVariable') : ''}</td>
                    <td class="propertyHandleSelectRelativePos">${item.switch == "timeSwitch" ? that._renderSourceSwitchTrRelativePos(item.selectVariable, item.relativePos) : ''}</td>
                </tr>`
        })
        str += "</tbody></table>";
        return str;
    }
    this._renderSourceSwitchTrRelativePos = function (variable, item, type) {
        var that = this,
            options = [{
                name: '条件位',
                value: 'conditionPos'
            }, {
                name: '不变',
                value: 'unchanged'
            }, {
                name: '替换位',
                value: 'replacePos'
            }, {
                name: '条件/替换',
                value: 'conditionReplace'
            }],
            attr = {
                "data-save": "relativePos",
                "data-change": "relativePos"
            },
            fieldVal = that._getpropertyRenderXYoption(variable),
            str = `<table class="table table-bordered" data-type="relativePos"><tbody>`;
        if (type == "source") {
            options = [{
                name: '条件',
                value: 'sourceCondition'
            }, {
                name: '值1',
                value: 'sourceValue1'
            }, {
                name: '值2',
                value: 'sourceValue2'
            }]
            attr = {
                "data-save": "sourceRelativePos",
                "data-change": "sourceRelativePos"
            }
            str = `<table class="table table-bordered" data-type="sourceRelativePos"><tbody>`;
        }
        fieldVal.forEach((ele, idx) => {
            if (Array.isArray(ele)) {
                ele.forEach((keys, index) => {
                    var itemIndex = item && item[index];
                    var regex = /\((.+?)\)/g,
                        matchText = keys.name.match(regex),
                        keysValue = matchText[0].substr(1, matchText[0].length - 2);
                    str += `<tr>
                    <td data-value="${item && itemIndex.key ? itemIndex.key : keysValue}" data-text = "${keys.name}">${item && itemIndex.name ? itemIndex.name : keys.name}</td>
                    <td>${that._renderSelect({ name: "请选择", value: '' }, options, item && itemIndex.selectedValue ? itemIndex.selectedValue : "", false, "from-control chosen", attr)}</td>
                </tr>`
                })
            } else {
                var itemIdx = item && item[idx];
                str += `<tr>
                    <td data-value="${item && itemIdx.key ? itemIdx.key : ele.value}" data-text = "${ele.name}">${item && itemIdx.name ? itemIdx.name : ele.name}</td>
                    <td>${that._renderSelect({ name: "请选择", value: '' }, options, item && itemIdx.selectedValue ? itemIdx.selectedValue : "", false, "from-control chosen", attr)}</td>
                </tr>`
            }
        })
        str += '</tbody></table>'
        return str;
    }



    this._renderNewbuiltConfigure = function (propertyHandle) {
        var that = this,
            variable = propertyHandle ? propertyHandle.oldVariable : "",
            cacheType = propertyHandle ? propertyHandle.cacheType : "",
            cacheVariable = propertyHandle ? propertyHandle.cacheVariable : "",
            cacheY = propertyHandle ? propertyHandle.cacheY : "",
            cname = propertyHandle ? propertyHandle.cname : "",
            ename = propertyHandle ? propertyHandle.ename : "",
            Xaxis = propertyHandle ? propertyHandle.Xaxis : "",
            XaxisName = propertyHandle ? propertyHandle.XaxisName : "",
            relativeX = propertyHandle ? propertyHandle.XaxisRelative : "",
            Yaxis = propertyHandle ? propertyHandle.Yaxis : [],
            YaxisVal = propertyHandle ? propertyHandle.YaxisVal : [],
            cachePosition = propertyHandle ? propertyHandle.cachePosition : "",
            renderType = propertyHandle ? propertyHandle.renderType : "",
            cacheMark = propertyHandle ? propertyHandle.cacheMark : "",
            handles = propertyHandle ? propertyHandle.handles : [],
            handleResults = handles.find((item) => { return item.switch == "timeSwitch" });

        str = `<table class="table table-bordered" style="margin-bottom: 0px;">
                <thead>
                    <tr>
                        <th class="text-center">缓存方式</th>
                        <th class="text-center">Y轴配置</th>
                        <th class="text-center">X轴配置</th>
                        <th class="text-center">值配置</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>${that._renderNewbuiltConfigureName(cacheType, cname, ename, cacheVariable, cacheY, cachePosition, renderType, cacheMark)}</td>
                        <td>${that._renderNewbuiltConfigureX(handleResults ? handleResults.selectVariable : variable, Xaxis, XaxisName, relativeX, cacheVariable)}</td>
                        <td>${that._renderNewbuiltConfigureY(handleResults ? handleResults.selectVariable : variable, Yaxis, cacheVariable)}</td>
                        <td>${that._renderNewbuiltConfigureVal(handleResults ? handleResults.selectVariable : variable, YaxisVal, cacheVariable)}</td>
                    </tr>
                </tbody>
                </table>`
        return str;
        // <td>${that._renderNewbuiltConfigureX(variable, Xaxis, XaxisName, relativeX, cacheVariable)}</td>
        // <td>${that._renderNewbuiltConfigureY(variable, Yaxis, cacheVariable)}</td>
        // <td>${that._renderNewbuiltConfigureVal(variable, YaxisVal, cacheVariable)}</td>
    }
    this._renderNewbuiltConfigureName = function (selectedValue, cname, ename, cacheVariable, cacheY, cachePosition, renderType, cacheMark) {
        var options = [{ name: "独立缓存", value: 'independentCache' }, { name: "至缓存数据", value: 'cacheData' }],
            attr = {
                "data-save": "cacheType",
                "data-change": "cacheType"
            },
            that = this;
        var str = `<table class="table table-bordered">
                        <tbody>
                            <tr>
                                <td>
                            ${that._renderSelect({ name: "请选择缓存方式", value: '' }, options, selectedValue, false, "from-control chosen", attr)}
                                </td>
                                <td>
${cacheY && cacheVariable ? that._renderNewbuiltCacheData(cacheVariable, cacheY, cachePosition, renderType, cacheMark) : cname && ename ? that._renderNewbuiltIndependentCache(cname, ename) : ""}
                                </td>
                            </tr>
                        </tbody>
                    </table>`;
        // var str = ` <table class="table table-bordered">
        //                 <thead>
        //                     <tr>
        //                         <th class="text-center">中文名</th>
        //                         <th class="text-center">中文名</th>
        //                         <th class="text-center">英文名</th>
        //                     </tr>
        //                 </thead>
        //                 <tbody>
        //                     <tr>
        //                         <td><input type="text" class="form-control" value="${cname ? cname : ""}" data-save="cname"/></td>
        //                         <td><input type="text" class="form-control" disabled="disabled" value="${ename ? ename : $eleSelect}"   data-save="ename"/></td>
        //                     </tr>
        //                 </tbody>
        //             </table>`;
        return str;
    }
    this._renderNewbuiltIndependentCache = function (cname, ename) {
        var $eleSelect = $(".pm-elem3.selected").text() + '_CAA';
        var str = ` <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th class="text-center">中文名</th>
                                <th class="text-center">英文名</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><input type="text" class="form-control" value="${cname ? cname : ""}" data-save="cname"/></td>
                                <td><input type="text" class="form-control" disabled="disabled" value="${ename ? ename : $eleSelect}"   data-save="ename"/></td>
                            </tr>
                        </tbody>
                    </table>`;
        return str;
    },
        this._renderNewbuiltCacheData = function (variable, Yaxis, cachePosition, renderType, cacheMark) {
            var that = this,
                str = ` <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th class="text-center">选择数据库存</th>
                            <th class="text-center">Y轴所在列</th>
                            <th class="text-center">存储标识</th>
                            <th class="text-center">插入方式</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>${that._renderCustomVariable(variable || "", 'cacheVariable')}</td>
                            <td>${that._renderPropertyHandleFields(variable, Yaxis, { "data-save": 'cacheY', "data-change": 'cacheY' })} </td>
                            <td>${that._renderNewbuiltCacheType(variable, cachePosition, cacheMark)}</td>
                            <td>${that._renderPropertyRenderType(renderType)}</td>
                        </tr>
                    </tbody>
                </table>`;
            return str;
        },
        this._renderNewbuiltCacheType = function (variable, cachePosition, cacheMark) {
            var that = this,
                str = `<table class="table table-bordered">
                    <tbody>
                        <tr>
                            <td class="cachePosition">${that._renderPropertyRenderFields(variable, cachePosition, true, "cachePosition")}</td>
                            <td><input type="text" disabled class="form-control" data-value="${cacheMark ? cacheMark : ''}" value="${Number(cachePosition) ? cacheMark ? cacheMark : '' : ''}" ></td>
                        </tr>
                    </tbody>
                </table>`;
            return str;
            // <td class="cachePosition">${that._renderPropertyHandleFields(variable,"", { "data-save": 'cachePosition', "data-change": 'cachePosition' })}</td>
        }
    this._renderNewbuiltConfigureX = function (variable, Xaxis, XaxisName, relativeX, cacheVariable) {
        var that = this,
            options = [{ name: '列名', value: 'columnName' }, { name: '值', value: 'columnVal' }],
            str = ` <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th class="text-center">选择字段</th>
                            <th class="text-center">选择段名</th>
                            <th class="text-center">缓存库对应字段</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="newbuiltConfigureX">${that._renderPropertyHandleFields(variable, Xaxis, { "data-save": 'XAxis', "data-change": 'XAxis' })} </td>
                            <td>
                            ${that._renderSelect({ name: '请选择显示类型', value: '' }, options, XaxisName, true, "from-control chosen", { 'data-save': 'XaxisName', 'data-change': 'XaxisName' })}
                            </td>
                            <td class="relativeX">${XaxisName == "columnName" ? that._renderPropertyHandleFields(cacheVariable, relativeX, { "data-save": 'relativeX', "data-change": 'relativeX' }) : ""} </td>
                        </tr>
                    </tbody>
                </table>`;
        return str;
        // <td>${that._renderPropertyRenderFields(variable, Xaxis, true)} </td>
    }
    this._renderNewbuiltConfigureY = function (variable, Yaxis, cacheVariable) {
        var that = this,
            str = `<table class="table table-bordered" style="margin-bottom: 0px;">
                        <thead>
                            <tr>
                            <th class="text-center">选择字段</th>
                                <th class="text-center">选择段名</th>
                                <th class="text-center">缓存库对应字段</th>
                                <th class="text-center">分割</th>
                                <th class="text-center"><span class="add" data-add="newbuiltConfigureY">+</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            ${that.newbuiltConfigureY(variable, Yaxis, cacheVariable, options)}
                        </tbody>
                    </table>`
        return str;
    }
    this.newbuiltConfigureY = function (variable, Yaxis, cacheVariable, options) {
        var that = this,
            options = [{ name: '列名', value: 'columnName' }, { name: '值', value: 'columnVal' }],
            str = "";
        Yaxis && Yaxis.forEach(item => {
            str += `    <tr class="YaxisTr">
                            <td class="newbuiltConfigureY">${that._renderPropertyHandleFields(variable, item.field, { "data-save": 'field', "data-change": 'field' })}</td>
                            <td>
                                ${that._renderSelect({ name: '请选择显示类型', value: '' }, options, item.yaxisName, true, "from-control chosen", { 'data-save': 'yaxisName', 'data-change': 'yaxisName' })}
                            </td>
                            <td class="relativeY">${item.yaxisName == "columnName" ? that._renderPropertyHandleFields(cacheVariable, item.yaxisRelative, { "data-save": 'relativeY', "data-change": 'relativeY' }) : ""}</td>
                            <td><input type="text" class="form-control" value="${item.split || ''}" data-save="split"></td>
                            <td><span class="del" data-attr="handle">×</span></td>
                        </tr>`;
        })
        return str;
    }
    this._renderNewbuiltConfigureVal = function (variable, YaxisVal, cacheVariable) {
        var that = this,
            str = `<table class="table table-bordered" style="margin-bottom: 0px;">
                    <thead>
                        <tr>
                        <th class="text-center">选择字段</th>
                            <th class="text-center">选择段名</th>
                            <th class="text-center">缓存库对应字段</th>
                            <th class="text-center">分割</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${that.newbuiltConfigureVal(variable, YaxisVal, cacheVariable)}
                    </tbody>
                </table>`
        return str;
    }
    this.newbuiltConfigureVal = function (variable, YaxisVal, cacheVariable) {
        var that = this,
            options = [{ name: '列名', value: 'columnName' }, { name: '值', value: 'columnVal' }],
            str = "";
        YaxisVal && YaxisVal.forEach(item => {
            str += ` <tr class="YaxisValTr">
                        <td class="newbuiltConfigureVal">${that._renderPropertyHandleFields(variable, item.field, { "data-save": 'field', "data-change": 'field' })}</td>
                        <td>${that._renderSelect({ name: '请选择显示类型', value: '' }, options, item.valName, true, "from-control chosen", { 'data-save': 'valName', 'data-change': 'valName' })}</td>
                        <td class="relativeVal">${item.valName == "columnName" ? that._renderPropertyHandleFields(cacheVariable, item.yaxisRelativeVal, { "data-save": 'relativeVal', "data-change": 'relativeVal' }) : ""}</td>
                        <td><input type="text" class="form-control" value="${item.split || ''}" data-save="split"></td>
                    </tr>`;
        })
        return str;
    }
    //变量文件对应Y轴
    this._renderPropertyRenderYaxis = function (variable, Yaxis) {
        var that = this,
            str = `<table class="table table-bordered" style="margin-bottom: 0px;">
                    <thead>
                        <tr>
                            <th class="text-center">字段</th>
                            <th class="text-center">表头</th>
                            <th class="text-center">分割</th>
                            <th class="text-center"><span class="add" data-add="propertyRenderYaxis">+</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        ${that.propertyRenderYaxis(variable, Yaxis)}
                    </tbody>
                    </table>`
        return str;
    }
    // this._renderPropertyHandleYaxis = function (variable, Yaxis) {
    //     var that = this,
    //         str = `<table class="table table-bordered" style="margin-bottom: 0px;">
    //                 <thead>
    //                     <tr>
    //                         <th class="text-center">字段</th>
    //                         <th class="text-center">分割</th>
    //                         <th class="text-center">是键位</th>
    //                         <th class="text-center">值</th>
    //                         <th class="text-center"><span class="add" data-add="propertyHandleYaxis">+</span></th>
    //                     </tr>
    //                 </thead>
    //                 <tbody>
    //                     ${that.propertyHandleYaxis(variable, Yaxis)}
    //                 </tbody>
    //                 </table>`
    //     return str;
    // }
    // this.propertyHandleYaxis = function (variable, Yaxis) {
    //     var that = this,
    //         str = "";
    //     Yaxis && Yaxis.forEach(item => {
    //         str += `<tr class="YaxisTr">
    //                     <td>${that._renderPropertyHandleFields(variable, item.field, { "data-save": 'field', "data-change": 'field' })}</td>
    //                     <td><input type="text" class="form-control" value="${item.split || ''}" data-save="split"></td>
    //                     <td><input type="checkbox" class="form-control" ${item.isKey ? "checked" : ""} data-save="isKey"></td>
    //                     <td>${that._renderPropertyHandleFields(variable, item.content, { "data-save": 'content', "data-change": 'content' })}</td>
    //                     <td><span class="del">×</span></td>
    //             </tr>`
    //     })
    //     return str;

    // }
    this.propertyRenderYaxis = function (variable, Yaxis) {
        var that = this,
            str = "";

        Yaxis && Yaxis.forEach(item => {
            str += `<tr class="YaxisTr">
                        <td>${that._renderPropertyRenderFields(variable, item.name, false, "keyWord")}</td>
                        <td><input class="form-control" type="text" data-save="headName" value="${item.headName ? item.headName : ''}"/></td>
                        <td><input type="text" class="form-control" value="${item.split}" data-save="split"></td>
                        <td><span class="del">×</span></td>
                    </tr>`
        })
        return str;
    }
    this._renderPropertyRenderContent = function (variable, content) {
        // var that = this,
        //     options = that._getpropertyRenderXYoption(variable);
        // return that._renderFieldsCheckBox(options, content);
    }
    this._getYaxis = function ($target) {
        var that = this,
            result = [];
        $target.each(function () {
            var config = {};
            config.name = $(this).find("[data-save='Yaxis']").val()
            config.headName = $(this).find("[data-save='headName']").val()
            config.split = $(this).find("[data-save='split']").val()
            result.push(config)
        })
        return result;

    }
    // this._getPropertyHandleYaxis = function ($target) {
    //     var that = this,
    //         result = [];
    //     $target.each(function () {
    //         var config = {};
    //         config.field = $(this).find("[data-save='field']").val()
    //         config.split = $(this).find("[data-save='split']").val()
    //         config.content = $(this).find("[data-save='content']").val()
    //         result.push(config)
    //     })
    //     return result;
    // }
    this._getPropertyHandleYaxis = function ($target) {
        var result = [];
        $target.each(function () {
            var config = {};
            config.field = $(this).find("[data-save='field']").val();
            config.fieldText = $(this).find("[data-save='field'] option:selected").attr('data-text');
            config.yaxisName = $(this).find("[data-save='yaxisName']").val();
            config.yaxisNameText = $(this).find("[data-save='yaxisName'] option:selected").attr('data-text');
            config.yaxisRelative = $(this).find("[data-save='relativeY']").val();
            config.split = $(this).find("[data-save='split']").val();
            result.push(config)
        })
        return result;
    }
    this._getPropertyHandleYaxisVal = function ($target) {
        var result = [];
        $target.each(function () {
            var config = {};
            config.field = $(this).find("[data-save='field']").val();
            config.valName = $(this).find("[data-save='valName']").val();
            config.fieldText = $(this).find("[data-save='field'] option:selected").attr('data-text');
            config.yaxisNameText = $(this).find("[data-save='valName'] option:selected").attr('data-text');
            config.yaxisRelativeVal = $(this).find("[data-save='relativeVal']").val();
            config.split = $(this).find("[data-save='split']").val();
            result.push(config)
        })
        return result;
    }
    this.bindChosen = function () {
        $(".chosen").chosen({
            no_results_text: "没有找到想要的数据",
            search_contains: true,
            allow_single_deselect: true,
            width: "100%",
        })
    }
    this.updataVariable = function (targets) {
        var that = this;
        targets.each(function () {
            var value = $(this).val(),
                str = that._renderCustomVariable(value);
            $(this).parents("td").eq(0).empty().append(str)
        })
        that.bindChosen()

    }
    this.getTableHead = function ($tr) {
        var that = this,
            result = [];
        $tr.each(function () {
            var config = {
                sortLine: $(this).find("[data-save='sortLine']").val(),
                name: $(this).find("[data-save='name']").val(),
                value: $(this).find("[data-save='value']").val()
            };
            result.push(config)
        })
        return result;
    }
    this.getExtendHead = function ($tr) {
        var that = this,
            result = [];
        $tr.each(function () {
            var config = {
                sortLine: $(this).find("[data-save='sortLine']").val(),
                name: $(this).find("[data-save='name']").val(),
                value: $(this).find("[data-save='value']").val()
            };
            result.push(config)
        })

        return result;
    }
    this.getLastline = function ($tr) {
        var result = [];
        $tr.each(function () {
            var config = {
                remarks: $(this).find('[data-save="remarks"]').val(),
                range: $(this).find('[data-save="range"]').val()
            }
            result.push(config)
        })
        return result;
    }
    this.getFixedFirstLine = function ($tr) {
        var result = [];
        $tr.each(function () {
            var config = {
                sortLine: $(this).find('[data-save="sortLine"]').val(),
                name: $(this).find('[data-save="name"]').val(),
                value: $(this).find('[data-save="value"]').val()
            }
            result.push(config);
        })
        return result;
    }
    this.getFixedLastLine = function ($tr) {
        var result = [];
        $tr.each(function () {
            var config = {
                sortLine: $(this).find('[data-save="sortLine"]').val(),
                name: $(this).find('[data-save="name"]').val(),
                value: $(this).find('[data-save="value"]').val()
            }
            result.push(config);
        })
        return result;
    }
    this.getOtherConfig = function ($td) {
        var that = this,
            result = {};
        $td.find('input').each(function (index, item) {
            var key = $(item).attr('data-save'),
                value = $(item).val();
            result[key] = value;
        })
        return result;
    }
    this.getRelativePos = function ($td, relativeVal) {
        var $tr = $td.find('tr'),
            result = [];
        if ($tr.length) {
            for (var i = 0; i < $tr.length; i++) {
                var key = $tr.eq(i).find('td').eq(0).attr("data-value"),
                    name = $tr.eq(i).find('td').eq(0).text(),
                    pos = $tr.eq(i).find('[data-save=' + relativeVal + ']').val(),
                    resultObj = { key: key, name: name, selectedValue: pos };
                result.push(resultObj)
            }
            return result;
        }
    }
    this.computerPageRenderTr = function (computerPage = {}) {
        var str = "",
            that = this;
        if (computerPage == null) computerPage = {};
        str = `<tr class="computerPageTr">
                <td class="compageVariable">
                    ${that._renderCustomVariable(computerPage.variable || "")}
                </td>
                <td>
                    <input type="text" class="form-control" data-save="startRows" value="${computerPage.startRows || ''}">
                </td>
                <td>
                    <input type="text" class="form-control" data-save="endRows" value="${computerPage.endRows || ''}">
                </td>
                <td>
                    ${that._computerPageFields(computerPage.variable, computerPage.startColumns, { "data-save": "startColumns", "data-change": "startColumns" })}
                </td>
                <td>
                    ${that._computerPageFields(computerPage.variable, computerPage.endColumns, { "data-save": "endColumns", "data-change": "endColumns" })}
                </td>
                <td>
                    ${that._renderSelect({ name: "请选择计算方向", value: '' }, that.computerDirection, computerPage.direction, false, "from-control chosen", {
            "data-save": "direction",
            "data-change": "direction"
        })}
                </td>
                <td>
                    <div>
                        <input type="button" class="form-control operator" value="*">
                        <input type="button" class="form-control operator " value="+">
                        <input type="button" class="form-control operator" value="-">
                        <input type="button" class="form-control operator" value="×">
                        <input type="button" class="form-control operator" value="÷">
                        <input type="button" class="form-control operator" value="->">
                        <input type="button" class="form-control operator" value="(">
                        <input type="button" class="form-control operator" value=")">
                    </div>
                </td>
                <td>
                    ${that._computerPageFields(computerPage.variable, computerPage.valuePosition, { "data-save": "valuePosition", "data-change": "valuePosition" })}
                </td>
                <td>
                    <input type="text" class="form-control expression" data-save="expression" value='${computerPage.expression || ""}'/>
                </td>
                <td>
                    <div>
                        <input type="button" class="form-control ruleoperator" value="*">
                        <input type="button" class="form-control ruleoperator " value="+">
                        <input type="button" class="form-control ruleoperator" value="-">
                        <input type="button" class="form-control ruleoperator" value="×">
                        <input type="button" class="form-control ruleoperator" value="÷">
                        <input type="button" class="form-control ruleoperator" value="->">
                        <input type="button" class="form-control ruleoperator" value="(">
                        <input type="button" class="form-control ruleoperator" value=")">
                    </div>
                </td>
                
                <td>
                    ${that._computerPageFields(computerPage.variable, computerPage.ruleValuePosition, { "data-save": "ruleValuePosition", "data-change": "ruleValuePosition" })}
                </td>
                <td>
                    <input type="text" class="form-control ruleExpression" data-save='ruleExpression' value="${computerPage.ruleExpression || ''}"/>
                </td>
                <td>
                ${that._renderSelect({ name: "请选择渲染类型", value: '' }, that.renderType, computerPage.renderType, false, "from-control chosen", {
            "data-save": "renderType",
            "data-change": "renderType"
        })}
                </td>
                <td>
                    ${that._computerPageRenderColums(computerPage.variable, computerPage.renderposition, { "data-save": "renderposition", "data-change": "renderposition" })}
                </td>
                <td>
                    ${that.computerPageRenderFields(computerPage.variable, computerPage.renderposition, computerPage.renderFild, { "data-save": "renderFild", "data-change": "renderFild" })}
                </td>
            </tr>`;
        return str;
    }
    this.computerPageRenderFields = function (variable, renderposition, selectedValue, attr) {
        var that = this,
            defaultOption = { name: "请选择", value: "" },
            options = [],
            isPrompt = true,
            selectClass = "from-control chosen",
            attr = attr;

        if (variable && renderposition) {
            var data = {};
            GLOBAL_PROPERTY.BODY && GLOBAL_PROPERTY.BODY.customVariable && GLOBAL_PROPERTY.BODY.customVariable.forEach(function (item, index) {
                if (variable == item.key) {
                    console.log(variable, item.key)
                    data.dbName = item.dbName;
                    data.table = item.table;
                    data.id = renderposition
                }
            })
            var options = new BuildTableJson().getOptions(AllDbName, 'fieldSplit', data);
        }
        return that._renderSelect(defaultOption, options, selectedValue, isPrompt, selectClass, attr)
    }
    this._computerPageRenderColums = function (variable, selectedValue, attr) {
        var that = this,
            defaultOption = { name: "请选择", vlaue: "" },
            options = variable ? that._getpropertyRenderXYoption(variable) : [],
            isPrompt = true,
            selectClass = "from-control chosen",
            attr = attr;
        options.unshift({ name: "本字段本表", value: "thisFields" })
        return that._renderSelect(defaultOption, options, selectedValue, isPrompt, selectClass, attr)
    }
    this._computerPageFields = function (variable, selectedValue, attr) {
        var that = this,
            defaultOption = {
                name: "请选择",
                value: ""
            },
            options = variable ? that._getpropertyRenderXYoption(variable) : [],
            selectedValue = selectedValue,
            isPrompt = true,
            selectClass = "from-control chosen",
            attr = attr;
        return that._renderSelect(defaultOption, options, selectedValue, isPrompt, selectClass, attr)
    }
}
newEventsProperty.prototype = {
    //渲染属性数据
    renderPropertyQueryData: function (propertyData) {
        var that = this,
            str = `<div class="condition   propertyData" ${propertyData ? "" : 'style="display:none"'}>
                        <table class="table table-bordered">
                            <caption>属性数据</caption>
                            <thead>
                                <tr>
                                    <th class="text-center">变量中文名</th>
                                    <th class="text-center">选择数据库</th>
                                    <th class="text-center">选择数据表</th>
                                    <th class="text-center">查询条件</th>
                                    <th class="text-center" style="width:600px">选择字段</th>
                                    <th><span class="add" data-add="_renderPropertyDataTr">＋</span></th>
                                </tr>
                            </thead>
                            <tbody>
                                
                               ${that._renderPropertyDataTr(propertyData)}
                            </tbody>
                        </table>
                   </div>`;
        return str;
    },
    //渲染属性查询
    renderPropertyQuery: function (propertyQuerys) {

        var that = this,
            str = `<div class="condition propertyQuery" ${propertyQuerys ? "" : 'style="display:none"'}>
                        <table class = "table table-bordered">
                            <caption>属性查询</caption>
                            <thead>
                                <tr>
                                    <th class="text-center">请选择自定义变量</th>
                                    <th class="text-center">变量中文名</th>
                                    <th class="text-center">查询条件</th>
                                    <th class="text-center" style="width:500px">请选择字段</th>
                                    <th class="text-center"><span class="add" data-add="_renderPropertyQueryTr">+</span></th>
                                </tr>
                            </thead>
                            <tbody>
                               ${that._renderPropertyQueryTr(propertyQuerys)} 
                            </tbody> 
                        </table>
                    </div>`
        return str;
    },
    //渲染属性处理
    renderPropertyHandle: function (propertyHandle) {
        var that = this,

            //     str = `<div class="condition propertyHandle" ${propertyHandle ? "" : 'style="display:none"'}>
            //             <table class="table table-bordered">
            //                 <caption>属性处理</caption>
            //                 <thead>
            //                     <tr>
            //                         <th class="text-center"><span class="add" data-add="_renderPropertyHandleBodYTr">+</span></th>
            //                         <th class="text-center">变量中文名</th>
            //                         <th class="text-center">自定义变量</th>
            //                         <th class="text-center">X轴</th>
            //                         <th class="text-center">Y轴</th>
            //                         <th class="text-center">操作</th>
            //                     </tr>
            //                 </thead>
            //                 <tbody class="propertyHandleTbody">
            //                     ${that._renderPropertyHandleBodYTr(propertyHandle ? propertyHandle : [{ variable: "", handles: [], Xaxis: "", Yaxis: [] }])}
            //                 </tbody>
            //             </table>
            //         </div>`
            // return str;
            str = `<div class="condition propertyHandle" ${propertyHandle ? "" : 'style="display:none"'}>
                        <table class="table table-bordered">
                            <caption>属性处理</caption>
                            <thead>
                                <tr>
                                    <th class="text-center"><span class="add" data-add="_renderPropertyHandleBodYTr">+</span></th>
                                    <th class="text-center">源变量相关配置</th>
                                    <th class="text-center">新建变量相关配置</th>
                                </tr>
                            </thead>
                            <tbody class="propertyHandleTbody">
                                ${that._renderPropertyHandleBodYTr(propertyHandle ? propertyHandle : [{ variable: "", handles: [], Xaxis: "", Yaxis: [], YaxisVal: [] }])}
                            </tbody>
                        </table>
                    </div>`
        return str;

    },
    renderExtendCol: function (extendCol) {

        var that = this,
            str = `<div class="condition   extendCol"  ${extendCol ? "" : 'style="display:none"'}>
                <table class="table table-bordered">
                    <caption>属性表头</caption>
                    <thead>
                        <tr>
                            <th class="text-center"><span class="add" data-add="renderExtendColTr">+</span></th>
                            <th class="text-center">变量中文名</th>
                            <th class="text-center">请选择自定义变量</th>
                            <th class="text-center">表头首列配置</th>
                            <th class="text-center">开始</th>
                            <th class="text-center">结束</th>
                            <th class="text-center">开始截取</th>
                            <th class="text-center">结束截取</th>
                            <th class="text-center">分段符</th>
                            <th class="text-center">字段分段</th>
                            <th class="text-center">表头尾列扩展</th>
                        </tr>
                    </thead>
                    <tbody>
                    ${extendCol ? that.renderExtendColTr(extendCol) : ""}
                    </tbody>
                </table>
            </div>`
        return str;
    },
    propertyRender: function (propertyRenders) {
        // if (!propertyRender) {
        //     propertyRender = {}
        // }
        var that = this,
            str = `<div class="condition propertyRender" ${propertyRenders ? "" : 'style="display:none"'}>
                <table class="table table-bordered">
                    <caption>属性渲染</caption>
                    <thead>
                        <tr>
                            <th class="text-center"><span class="add" data-add="_renderPropertyRenderTr">+</span></th>
                            <th class="text-center">变量文件</th>
                            <th class="text-center">表头变量</th>
                            <th class="text-center">表头变量<div style="font-size:10px">Y轴所在列</div></th>
                            <th class="text-center">变量文件对应Y轴</th>
                            <th class="text-center">变量文件对应X轴</th>
                            <th class="text-center">渲染类型</th>
                            <th class="text-center">渲染位置</th>
                            <th class="text-center">渲染颜色</th>
                            <th class="text-center">列宽</th>
                        </tr>
                    </thead>
                    <tbody class="propertyRenderTbody" data-propertyRenders = '${Array.isArray(propertyRenders) ? "" : JSON.stringify(propertyRenders)}'>
                        ${that._renderPropertyRenderTr(propertyRenders)}
                    </tbody>
                </table>
            </div>`;
        return str;
    },
    //页面计算
    computerPageRender: function (computerPage) {
        var that = this,
            str = `<div class="condition computerPage" ${computerPage ? "" : 'style="display:none"'}>
                <table class="table table-bordered">
                    <caption>页面计算</caption>
                    <thead>
                        <tr>
                            <th class="text-center">自定义变量</th>
                            <th class="text-center">起始行</th>
                            <th class="text-center">终止行</th>
                            <th class="text-center">起始列</th>
                            <th class="text-center">终止列</th>
                            <th class="text-center">计算方向</th>
                            <th class="text-center">运算符</th>
                            <th class="text-center">值所在位置</th>
                            <th class="text-center">表达式</th>
                            <th class="text-center">规则运算符</th>
                            <th class="text-center">规则值所在位置</th>
                            <th class="text-center">规则表达式</th>
                            <th class="text-center">渲染类型</th>
                            <th class="text-center">渲染列</th>
                            <th class="text-center">渲染段</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${that.computerPageRenderTr(computerPage)}
                    </tbody>
                </table>
            </div>`;
        return str;
    },
    //缓存数据库
    renderCacheDatabase: function (cacheDatabase) {
        var that = this,
            str = `<div class="condition cacheDatabase" ${cacheDatabase ? "" : 'style="display:none"'}>
                    <table class="table table-bordered">
                        <caption>缓存数据库</caption>
                        <thead>
                            <tr>
                                <th class="text-center"><span class="add" data-add="renderCacheDatabaseTr">+</span></th>
                                <th class="text-center">缓存数据库名、尾行配置</th>
                                <th class="text-center">固定首列配置</th>
                                <th class="text-center">动态列配置</th>
                                <th class="text-center">固定尾列配置</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${cacheDatabase ? that._renderCacheDatabaseTr(cacheDatabase) : ""}
                        </tbody>
                    </table>
                </div>`
        return str;
    },
    //获取属性数据
    getPropertyData: function ($tr, id, index) {
        var that = this,
            key = NumberHelper.idToName(index, 1),
            propertyData = [];
        $tr.each(function (Cindex) {
            var propertyDatatr = {}
            propertyDatatr.variable = id + "_A" + key + NumberHelper.idToName(Cindex, 1)
            propertyDatatr.cname = $(this).find('[data-save="cname"]').val()
            propertyDatatr.query = {}
            propertyDatatr.query.dbName = $(this).find('[data-save="dbName"]').val()
            propertyDatatr.query.table = $(this).find('[data-save="table"]').val()
            propertyDatatr.query.conditions = that._getQueryCondition($(this).find(".copySendCondition"))
            propertyDatatr.query.fields = that._getFields($(this).find(".checkboxField"));
            var data = {}
            data.key = propertyDatatr.variable
            data.cname = propertyDatatr.cname
            data.dbName = propertyDatatr.query.dbName
            data.table = propertyDatatr.query.table
            data.fields = propertyDatatr.query.fields
            if (!GLOBAL_PROPERTY.BODY) { //BODY存在吗
                GLOBAL_PROPERTY.BODY = {};
                GLOBAL_PROPERTY.BODY.customVariable = [];
                GLOBAL_PROPERTY.BODY.customVariable.push(data)
            } else {
                if (!GLOBAL_PROPERTY.BODY.customVariable) { //customVariable
                    GLOBAL_PROPERTY.BODY.customVariable = [];
                    GLOBAL_PROPERTY.BODY.customVariable.push(data)
                } else {
                    var number = -1;
                    GLOBAL_PROPERTY.BODY.customVariable.forEach(function (item, cindex) { //原有的存在吗
                        if (item.key == propertyDatatr.variable) {
                            number = cindex
                        }
                    })
                    if (number == -1) {
                        GLOBAL_PROPERTY.BODY.customVariable.push(data)
                    } else {
                        GLOBAL_PROPERTY.BODY.customVariable[number] = data;
                    }
                }
            }
            $('.propertyDataTr').eq(Cindex).find('input[type="text"][data-save="cname"]').attr("data-variable", propertyDatatr.variable)
            propertyData.push(propertyDatatr);
        })


        that.updataVariable($("[data-change='variable']"))
        return propertyData;
    },
    //获取页面计算的数据
    getComputerPage: function ($tr) {
        var that = this,
            result = {

            };
        $tr.each(function () {
            result.variable = $(this).find('[data-save="variable"]').val(),
                result.startRows = $(this).find('[data-save="expression"]').val(),
                result.endRows = $(this).find('[data-save="endRows"]').val(),
                result.startColumns = $(this).find('[data-save="startColumns"]').val(),
                result.endColumns = $(this).find('[data-save="endColumns"]').val(),
                result.direction = $(this).find('[data-save="direction"]').val(),
                result.expression = $(this).find('[data-save="expression"]').val(),
                result.ruleExpression = $(this).find('[data-save="ruleExpression"]').val(),
                result.renderType = $(this).find('[data-save="renderType"]').val(),
                result.renderposition = $(this).find('[data-save="renderposition"]').val(),
                result.renderFild = $(this).find('[data-save="renderFild"]').val()
        })
        console.log(result)
        return result;
    },
    //获取属性查询
    getPropertyQuery: function ($tr, id, index) {
        var that = this,
            key = NumberHelper.idToName(index, 1),
            propertyQuerys = [];
        $tr.each(function (cindex) {
            var propertyQuery = {},
                $oldVeriable = $(this).find('[data-save="variable"]'),
                cname = $(this).find('[data-save="cname"]').val(),
                oldVariable = $oldVeriable.val(),
                variable = id + "_B" + key + NumberHelper.idToName(cindex, 1);
            propertyQuery.variable = variable;
            propertyQuery.oldVariable = oldVariable
            propertyQuery.cname = cname;
            propertyQuery.query = {};
            // propertyQuery.query.dbName = $oldVeriable.parents("td").eq(0).attr("data-dbName");
            // propertyQuery.query.table = $oldVeriable.parents("td").eq(0).attr("data-table");
            propertyQuery.query.conditions = that._getQueryCondition($(this).find(".copySendCondition"));
            propertyQuery.fields = that._getFields($(this).find(".propertyQueryFields"));
            propertyQuerys.push(propertyQuery)
            var data = {};
            data.key = propertyQuery.variable;
            data.cname = propertyQuery.cname;
            data.fields = propertyQuery.fields;
            // data.dbName = propertyQuery.query.dbName;
            // data.table = propertyQuery.query.table;
            // GLOBAL_PROPERTY.BODY.customVariable.forEach(item => {
            //     if (item.key == propertyQuery.oldVariable) {
            //         data.dbName = item.dbName;
            //         data.table = item.table
            //     }
            // })
            var number = -1;
            GLOBAL_PROPERTY.BODY.customVariable.forEach((item, dindex) => {
                if (item.key == data.key) {
                    number = dindex;
                }
            })
            if (number == -1) {
                GLOBAL_PROPERTY.BODY.customVariable.push(data)
            } else {
                GLOBAL_PROPERTY.BODY.customVariable[number] = data;
            }
        })
        that.updataVariable($("[data-change='variable']"))
        return propertyQuerys;
    },
    //获取属性处理
    getPropertyHandle: function ($trs, id, key) {
        var that = this,
            key = NumberHelper.idToName(key, 1)
        results = [];
        console.log(results, "results");
        $trs.find(".propertyHandleVariable").each((index, $tr) => {
            var Yaxis = that._getPropertyHandleYaxis($($tr).find(".YaxisTr")),
                YaxisVal = that._getPropertyHandleYaxisVal($($tr).find(".YaxisValTr"));
            var result = {
                variable: "",
                oldVariable: "",
                cname: "",
                ename: "",
                Xaxis: "",
                XaxisName: "",
                cacheType: "",
                Yaxis: Yaxis,
                YaxisVal: YaxisVal,
                cacheVariable: '',
                cacheY: "",
                cacheType: "",
                handles: []
            },
                $propertyHandleConfig = $($tr).find(".propertyHandleConfig");
            var variable = id + "_C" + key + NumberHelper.idToName(index, 1),
                oldVariable = $($tr).find("[data-save='variable']").val(),
                cacheType = $($tr).find("[data-save='cacheType']").val(),
                Xaxis = $($tr).find("[data-save='XAxis']").val(),
                XaxisName = $($tr).find("[data-save='XaxisName']").val(),
                XaxisText = $($tr).find("[data-save='XAxis'] option:selected").attr("data-text"),
                XaxisNameText = $($tr).find("[data-save='XaxisName'] option:selected").attr("data-text"),
                XaxisRelative = $($tr).find("[data-save='relativeX']").val(),
                cname = $($tr).find("[data-save='cname']").val(),
                ename = $($tr).find("[data-save='ename']").val(),
                cacheVariable = $($tr).find("[data-save='cacheVariable']").val(),
                cacheY = $($tr).find("[data-save='cacheY']").val(),
                cachePosition = $($tr).find("[data-save='cachePosition']").val(),
                renderType = $($tr).find("[data-save='renderType']").val(),
                cacheMark = $($tr).find("[data-save='cachePosition']").parent().next().find('input').attr("data-value");
            result.Xaxis = Xaxis;
            result.XaxisName = XaxisName;
            result.XaxisRelative = XaxisRelative;
            result.cname = cname;
            result.ename = ename;

            result.cacheType = cacheType;
            result.cacheVariable = cacheVariable;
            result.cacheY = cacheY;
            result.cachePosition = cachePosition;
            result.renderType = renderType;
            result.cacheMark = cacheMark;
            result.variable = variable;
            // result.variable = ename ? ename : cacheVariable;
            result.oldVariable = oldVariable;
            $propertyHandleConfig.each((cindex, tr) => {
                var config = {},
                    $trParentsNext = $(tr).parents('td').eq(0).next();
                config.field = $(tr).find("[data-save='field']").val();
                config.operation = $(tr).find("[data-save='operation']").val();
                config.type = $(tr).find("[data-save='type']").val();
                config.switch = $trParentsNext.find("[data-save='switch']").eq(cindex).val();
                config.otherConfig = that.getOtherConfig($trParentsNext.find('.propertyHandleOtherConfig').eq(cindex));
                config.selectVariable = $trParentsNext.find(".propertyHandleSelectVariable").eq(cindex).find("[data-save='handleSelectVariable']").val();
                config.relativePos = that.getRelativePos($trParentsNext.find('.propertyHandleSelectRelativePos').eq(cindex), 'relativePos');
                config.sourceRelativePos = that.getRelativePos($trParentsNext.find('.propertyHandleSourceRelativePos').eq(cindex), 'sourceRelativePos');
                result.handles.push(config)
            })
            results.push(result)
            var data = {}
            // data.key = ename ? ename : oldVariable;
            data.key = variable;
            data.cname = cname;
            var handleResult = [];
            Yaxis.forEach((yaxisItem, yaxisIdx) => {
                var yaxisValItem = YaxisVal[yaxisIdx];
                var isYaxis = yaxisItem.fieldText.split("'");
                var yaxisResult = `${isYaxis.length > 1 ? isYaxis[0] : yaxisItem.fieldText}'${yaxisItem.yaxisNameText}'${yaxisItem.split}(x)`,
                    isYaxisVal = yaxisValItem.fieldText.split("'"),
                    yaxisValResult = yaxisValItem && `${isYaxisVal.length > 1 ? isYaxisVal[0] : yaxisValItem.fieldText}'${yaxisValItem.yaxisNameText}'${yaxisValItem.split}(val)`;
                if (isYaxis.length > 1) {
                    yaxisItem.field = yaxisResult;
                    yaxisItem.fieldText = yaxisResult;
                    yaxisValItem.field = yaxisValResult;
                    yaxisValItem.fieldText = yaxisValResult;
                }
                handleResult.push([{ "name": yaxisResult, "value": yaxisItem.yaxisRelative ? yaxisItem.yaxisRelative : 'x' }, { "name": yaxisValResult ? yaxisValResult : "", "value": "val" }])
            })
            var isXAxisText = XaxisText.split("'"),
                XaxisTextName = `${isXAxisText.length > 1 ? isXAxisText[0] : XaxisText}'${XaxisNameText}(y)`;
            Xaxis = isXAxisText.length > 1 ? XaxisTextName : Xaxis;
            XaxisText = isXAxisText.length > 1 ? XaxisTextName : XaxisText;
            handleResult[0] && handleResult[0].unshift({ "name": `${isXAxisText.length > 1 ? isXAxisText[0] : XaxisText}'${XaxisNameText}(y)`, "value": `${XaxisRelative ? XaxisRelative : 'y'}` });
            data.handleResult = handleResult;
            GLOBAL_PROPERTY.BODY.customVariable.forEach(item => {
                if (item.key == oldVariable) {
                    data.dbName = item.dbName;
                    data.table = item.table;
                }
            })
            var number = -1;
            GLOBAL_PROPERTY.BODY.customVariable.forEach((item, dindex) => {
                if (item.key == data.key) {
                    number = dindex;
                }
            })
            if (number == -1) {
                if (data.cname)
                    GLOBAL_PROPERTY.BODY.customVariable.push(data)
            } else {
                GLOBAL_PROPERTY.BODY.customVariable[number] = data;
            }

        })
        that.updataVariable($("[data-change='variable']"))
        console.log(results, "results");
        return results;
    },
    getExtendCol: function ($trs, id, key) {
        var that = this,
            key = NumberHelper.idToName(key, 1),
            resultData = [];
        // result = {};
        $trs.each(function (index, tr) {
            var result = {},
                variable = id + "_D" + key + NumberHelper.idToName(index, 1),
                cname = $(tr).find('[data-save="cname"]').val(),
                oldVariable = $(tr).find('[data-save="variable"]').val(),
                startText = $(tr).find('[data-save="startText"]').val(),
                endText = $(tr).find('[data-save="endText"]').val(),
                startSubstr = $(tr).find('[data-save="startSubstr"]').val(),
                endSubstr = $(tr).find('[data-save="endSubstr"]').val(),
                fieldSplit = $(tr).find('[data-save="fieldSplit"]').val(),
                splitMark = $(tr).find('[data-save="splitMark"]').val(),
                tableHead = that.getTableHead($(tr).find(".tableHead tbody tr")),
                extendHead = that.getExtendHead($(tr).find(".extendHeads tbody tr"));
            result.variable = variable;
            result.cname = cname;
            result.oldVariable = oldVariable;
            result.startText = startText;
            result.endText = endText;
            result.startSubstr = startSubstr;
            result.endSubstr = endSubstr;
            result.fieldSplit = fieldSplit;
            result.splitMark = splitMark;
            result.tableHead = tableHead;
            result.extendHead = extendHead;
            resultData.push(result);
            // })
            // if (!!!result.cname) return data;
            var fields = $.extend([], result.tableHead);
            result.extendHead.forEach(item => {
                if (item.name) {
                    fields.push(item)
                }
            })
            var data = {
                key: result.variable,
                cname: result.cname,
                fields: fields,
                fieldSplit: result.fieldSplit,
                splitMark: result.splitMark
            };
            GLOBAL_PROPERTY.BODY.customVariable.forEach(item => {
                if (item.key == result.oldVariable) {
                    data.dbName = item.dbName;
                    data.table = item.table
                }
            })
            var number = -1;
            GLOBAL_PROPERTY.BODY.customVariable.forEach((item, dindex) => {
                if (item.key == data.key) {
                    number = dindex;
                }
            })
            if (number == -1) {
                GLOBAL_PROPERTY.BODY.customVariable.push(data)
            } else {
                GLOBAL_PROPERTY.BODY.customVariable[number] = data;
            }
        })
        // if (!GLOBAL_PROPERTY.BODY.extendHead) {
        //     GLOBAL_PROPERTY.BODY.extendHead = [];
        //     GLOBAL_PROPERTY.BODY.extendHead.push(data);
        // } else {
        //     var number = -1;
        //     GLOBAL_PROPERTY.BODY.extendHead.forEach((item, dindex) => {
        //         if (item.key == data.key) {
        //             number = dindex;
        //         }
        //     })
        //     if (number == -1) {
        //         GLOBAL_PROPERTY.BODY.extendHead.push(data)
        //     } else {
        //         GLOBAL_PROPERTY.BODY.extendHead[number] = data;
        //     }
        // }
        // return result;
        return resultData;
    },
    getCacheDatabase: function ($trs) {
        var that = this,
            resultData = [];
        $trs.each(function (index, tr) {
            var result = {};
            result.cname = $(tr).find('[data-save="cname"]').val();
            result.ename = $(tr).find('[data-save="ename"]').val();
            result.lastLine = that.getLastline($(tr).find(".lastLine tbody tr"));
            result.variable = $(tr).find('[data-save="variable"]').val();
            result.fixedFirstLine = that.getFixedFirstLine($(tr).find(".fixedFirstLine tbody tr"));
            result.startText = $(tr).find('[data-save="startText"]').val();
            result.endText = $(tr).find('[data-save="endText"]').val();
            result.substr = $(tr).find('[data-save="substr"]').val();
            result.fieldSplit = $(tr).find('[data-save="fieldSplit"]').val();
            result.splitMark = $(tr).find('[data-save="splitMark"]').val();
            result.fixedLastLine = that.getFixedLastLine($(tr).find(".fixedLastLine tbody tr"));
            resultData.push(result);
            var fields = $.extend([], result.fixedFirstLine);
            result.fixedLastLine.forEach(item => {
                if (item.name) {
                    fields.push(item)
                }
            })
            var data = {
                key: result.ename,
                cname: result.cname,
                fields: fields,
                fieldSplit: result.fieldSplit,
                splitMark: result.splitMark,
                lastLine: result.lastLine
            };
            GLOBAL_PROPERTY.BODY.customVariable.forEach(item => {
                if (item.key == result.oldVariable) {
                    data.dbName = item.dbName;
                    data.table = item.table
                }
            })
            var number = -1;
            GLOBAL_PROPERTY.BODY.customVariable.forEach((item, dindex) => {
                if (item.key == data.key) {
                    number = dindex;
                }
            })
            if (number == -1) {
                GLOBAL_PROPERTY.BODY.customVariable.push(data)
            } else {
                GLOBAL_PROPERTY.BODY.customVariable[number] = data;
            }
        })
        return resultData;
    },
    //
    getPropertyRender: function ($trs) {
        var that = this,
            $tr = $trs.find(".propertyRenderTr"),
            data = [];
        if ($tr.length == 0) {
            data.push(JSON.parse($trs.attr(("data-propertyRenders"))));
            console.log(data, "data");
            return data;
        }
        $tr.each(function () {
            var result = {};
            result.variable = $(this).find('[data-save="variable"]').val();
            result.Xaxis = $(this).find('[data-save="XAxis"]').val();
            result.XVariable = $(this).find('[data-save="XVariable"]').val();
            result.Xline = $(this).find('[data-save="Xline"]').val();
            // result.content = that._getFields($(this).find(".propertyRenderContent"));
            result.Yaxis = that._getYaxis($(this).find(".YaxisTr"));
            result.renderType = $(this).find('[data-save="renderType"]').val();
            result.renderPositoon = $(this).find('[data-save="renderPositoon"]').val();
            result.renderColor = $(this).find('[data-save="color"]').val();
            result.ColWisth = $(this).find('[data-save="colWidth"]').val();
            data.push(result)
        })
        return data;
    },

    getXYValAxisSelect: function (that, isReplace, valueText, selectPrevTdText) {
        var thisParents = that.parents("tr").eq(3),
            xAxisSelect = thisParents.find('.newbuiltConfigureX [data-change="XAxis"]'),
            yAxisSelect = thisParents.find('.newbuiltConfigureY [data-change="field"]'),
            valAxisSelect = thisParents.find('.newbuiltConfigureVal [data-change="field"]'),
            trLength = that.parents("tbody").eq(0).children("tr").length,
            optionsLen = xAxisSelect.find("option"),
            vlaues = isReplace ? valueText ? valueText : "null" : selectPrevTdText;
        if (trLength == optionsLen.length - 1) {
            for (var j = 0; j < optionsLen.length; j++) {
                var xAxisOptionAttrText = optionsLen.eq(j).attr("data-text");
                if (selectPrevTdText == xAxisOptionAttrText) {
                    optionsLen.eq(j).val(vlaues).text(vlaues);
                    yAxisSelect.find("option").eq(j).val(vlaues).text(vlaues);
                    valAxisSelect.find("option").eq(j).val(vlaues).text(vlaues);
                }
            }
        } else {
            var optionHtml = `<option data-text="${selectPrevTdText}" value="${vlaues}">${vlaues}</option>`;
            xAxisSelect.append(optionHtml);
            yAxisSelect.append(optionHtml);
            valAxisSelect.append(optionHtml);
        }
        xAxisSelect.trigger("chosen:updated");
        yAxisSelect.trigger("chosen:updated");
        valAxisSelect.trigger("chosen:updated");
    },

    bindEvents: function () {
        var that = this;
        //属性数据数据库切换时
        that.$events.on("change" + that.NAME_SPACE, ".propertyData [data-change='dbName']", function () {
            var $fieldTd = $(this).parents("tr").eq(0).find(".queryFields");
            $fieldTd.empty();
        })
        //属性数据数据表切换时
        that.$events.on("change" + that.NAME_SPACE, ".propertyData [data-change='table']", function () {
            var tableName = $(this).val(),
                dbName = $($(this).parents("tr")[0]).find('[data-change="dbName"]').val(),
                $fieldTd = $(this).parents("tr").eq(0).find(".queryFields"),
                html = that._renderQueryFields(dbName, tableName, []);
            $fieldTd.empty().append(html)
        })
        //属性数据选择字段时
        that.$events.on("click" + that.NAME_SPACE, ".propertyData .checkboxField input", function () {
            var $target = $(this),
                id = $("#property_id").val(),
                index = $(this).parents('tr').eq(1).attr("index");
            that.getPropertyData(that.$events.find(".propertyDataTr"), id, index)
        })
        //数据查询切换自定义变量时
        that.$events.on("change" + that.NAME_SPACE, ".propertyQuery [data-change='variable']", function () {
            var value = $(this).val(),
                html = that._renderPropertyQueryFields(value, []),
                $propertyQueryFields = $(this).parents("tr").eq(0).find(".propertyQueryFields");
            // $propertyQueryFields = that.$events.find(".propertyQueryFields");
            $propertyQueryFields.empty().append(html);
            $(this).attr("data-selected", value);
        })
        //属性查询字段点击时候
        that.$events.on("click" + that.NAME_SPACE, ".propertyQueryFields input", function () {
            var id = $("#property_id").val(),
                index = $(this).parents('tr').eq(1).attr("index");
            that.getPropertyQuery(that.$events.find(".propertyQueryTr"), id, index)
        })
        //属性处理自定义变量切换的时候?还有问题
        that.$events.on("change" + that.NAME_SPACE, ".propertyHandleVariable [data-change='variable']", function () {
            var propertyHandleVariable = $(this).val(),
                cname = $(this).parents("td").eq(1).next().find("[data-save='cname']").val(),
                ename = $(this).parents("td").eq(1).next().find("[data-save='ename']").val(),
                data = [],
                html = "";
            GLOBAL_PROPERTY.BODY && GLOBAL_PROPERTY.BODY.customVariable && GLOBAL_PROPERTY.BODY.customVariable.forEach(function (item, index) {
                if (item.key == propertyHandleVariable) {
                    data = item.fields ? item.fields : item.handleResult
                }
                // JSON.parse(item.propertyData).forEach(citem => {
                //     if (citem.variable == propertyHandleVariable) {
                //         data = citem.query.fields
                //     }
                // })
                // item.propertyQuery && JSON.parse(item.propertyQuery).forEach(citem => {
                //     if (citem.variable == propertyHandleVariable) {
                //         data = citem.fields
                //     }
                // })
                // if (item.key == propertyHandleVariable) {
                //     if (GLOBAL_PROPERTY.BODY.customVariable[index].propertyData) {
                //         data = JSON.parse(GLOBAL_PROPERTY.BODY.customVariable[index].propertyData).query.fields
                //     }
                //     if (GLOBAL_PROPERTY.BODY.customVariable[index].propertyQuery) {
                //         data = JSON.parse(GLOBAL_PROPERTY.BODY.customVariable[index].propertyQuery).fields
                //     }
                //     // if (GLOBAL_PROPERTY.BODY.customVariable[index].propertyHandle) {
                //     //     check = true;
                //     //     data = JSON.parse(GLOBAL_PROPERTY.BODY.customVariable[index].propertyHandle).handles
                //     // }
                // }
            })
            // if (!check) {
            var handles = [];
            if (data) {
                data = DataType.isArray(data[0]) ? data[0] : data
            }
            data && data.forEach(item => {
                var config = {
                    field: item.value,
                    operation: "",
                    type: "",
                    switch: ""
                }
                handles.push(config)
            })
            var result = [{
                cname: cname,
                ename: ename,
                oldVariable: propertyHandleVariable,
                handles: handles,
                Xaxis: "",
                Yaxis: ''
            }];
            console.log(result, 'result');
            html = that._renderPropertyHandleBodYTr(result)

            $(this).parents("tr").eq(1).replaceWith($(html))
            that.bindChosen()
        })
        //属性处理操作类型切换时
        that.$events.on("change" + that.NAME_SPACE, ".propertyHandleVariable [data-change='operation']", function () {
            var operation = $(this).val(),
                $thisTrIdx = $(this).parents("tr").eq(0).prevAll().length,
                $target = $(this).parents("td").eq(1).next().find("[data-change='switch']").eq($thisTrIdx),
                $config = $(this).parents("tr").eq(0).find(".propertyHandleConfig");
            if (operation != "dataSwitch") {
                $target.val("")
                $target.attr("disabled", "disabled")
            } else {
                $target.attr("disabled", false)
            }
            $config.empty()
            $('.chosen').trigger('chosen:updated');

        })
        //属性处理数据格式转换配置
        that.$events.on("change" + that.NAME_SPACE, ".propertyHandleVariable [data-change='switch']", function () {
            var changType = $(this).val(),
                $target = $(this).parents("tr").eq(0).find(".propertyHandleOtherConfig"),
                $targetSelectVariable = $(this).parents("tr").eq(0).find(".propertyHandleSelectVariable"),
                $targetSelectRelativePos = $(this).parents("tr").eq(0).find(".propertyHandleSelectRelativePos"),
                $targetSourceRelativePos = $(this).parents("tr").eq(0).find(".propertyHandleSourceRelativePos"),
                str = "",
                strSelectVariable = "",
                strSourceRelativePos = "";
            // strRelativePos = "";
            if (changType == "timeSwitch") {
                str = that._renderPropertyConfig({}, changType);
                strSelectVariable = that._renderCustomVariable("", 'handleSelectVariable');
                var variable = $(this).parents("tr").eq(1).find('[data-save="variable"]').val();
                strSourceRelativePos = that._renderSourceSwitchTrRelativePos(variable, '', 'source');
            }
            $target.empty().append(str);
            $targetSelectVariable.empty().append(strSelectVariable);
            $targetSourceRelativePos.empty().append(strSourceRelativePos);
            $targetSelectRelativePos.empty();
            that.bindChosen();
        })
        //属性处理数据格式转换配置--索引对应位置
        that.$events.on("change" + that.NAME_SPACE, ".propertyHandleVariable [data-change='relativePos']", function () {
            // var $relativePos = $(this).parents("tr").eq(1).find(".propertyHandleSelectRelativePos [data-save='relativePos']");
            var $sourceRelativePosSelect = $(this).parents("tr").eq(1).find(".propertyHandleSourceRelativePos [data-save='sourceRelativePos']");
            var valueText = "",
                isReplace = false;
            for (var i = 0; i < $sourceRelativePosSelect.length; i++) {
                var select = $($sourceRelativePosSelect).eq(i),
                    value = select.val();
                if (value.indexOf('sourceValue') >= 0) {
                    valueText += select.find("option:selected").attr("data-text")
                }
            }
            var $thisVal = $(this).val();
            var selectPrevTdText = $(this).parent().prev("td").attr("data-text");
            if ($thisVal == "conditionReplace" || $thisVal == "replacePos") {
                isReplace = true;
                $(this).parent().prev("td").text(valueText);
            } else {
                $(this).parent().prev("td").text(selectPrevTdText);
            }


            that.getXYValAxisSelect($(this), isReplace, valueText, selectPrevTdText);

            // var thisParents = $(this).parents("tr").eq(3),
            //     xAxisSelect = thisParents.find('.newbuiltConfigureX [data-change="XAxis"]'),
            //     yAxisSelect = thisParents.find('.newbuiltConfigureY [data-change="field"]'),
            //     valAxisSelect = thisParents.find('.newbuiltConfigureVal [data-change="field"]'),
            //     trLength = $(this).parents("tbody").eq(0).children("tr").length,
            //     optionsLen = xAxisSelect.find("option"),
            //     vlaues = isReplace ? valueText : prevTdText;
            // if (trLength == optionsLen.length - 1) {
            //     for (var j = 0; j < optionsLen.length; j++) {
            //         var xAxisOptionAttrText = optionsLen.eq(j).attr("data-text");
            //         if (prevTdText == xAxisOptionAttrText) {
            //             optionsLen.eq(j).val(vlaues).text(vlaues);
            //             yAxisSelect.find("option").eq(j).val(vlaues).text(vlaues);
            //             valAxisSelect.find("option").eq(j).val(vlaues).text(vlaues);
            //         }
            //     }
            // } else {
            //     var optionHtml = `<option data-text="${prevTdText}" value="${vlaues}">${vlaues}</option>`
            //     xAxisSelect.append(optionHtml);
            //     yAxisSelect.append(optionHtml);
            //     valAxisSelect.append(optionHtml);
            // }
            // xAxisSelect.trigger("chosen:updated");
            // yAxisSelect.trigger("chosen:updated");
            // valAxisSelect.trigger("chosen:updated");
        })
        //属性处理数据格式转换配置--源对应位置
        that.$events.on("change" + that.NAME_SPACE, ".propertyHandleVariable [data-change='sourceRelativePos']", function () {
            var $relativePos = $(this).parents("tr").eq(1).find(".propertyHandleSelectRelativePos [data-save='relativePos']");
            var $sourceRelativePosSelect = $(this).parents("tr").eq(1).find(".propertyHandleSourceRelativePos [data-save='sourceRelativePos']");
            var valueText = "",
                isReplace = false,
                j = 0;
            for (var i = 0; i < $sourceRelativePosSelect.length; i++) {
                var select = $($sourceRelativePosSelect).eq(i),
                    value = select.val();
                if (value.indexOf('sourceValue') >= 0) {
                    valueText += select.find("option:selected").attr("data-text")
                }
            }
            for (; j < $relativePos.length; j++) {
                var select = $($relativePos).eq(j).parent().prev("td"),
                    selectPrevTdText = select.attr("data-text"),
                    value = $($relativePos).eq(j).val();
                if (value == "conditionReplace" || value == "replacePos") {
                    isReplace = true;
                    if (!valueText) valueText = selectPrevTdText;
                    break;
                } else {
                    select.attr(selectPrevTdText);
                }
            }
            $($relativePos).eq(j).parent().prev("td").text(valueText);

            that.getXYValAxisSelect($(this), isReplace, valueText, selectPrevTdText)

            // var thisParents = $(this).parents("tr").eq(3),
            //     xAxisSelect = thisParents.find('.newbuiltConfigureX [data-change="XAxis"]'),
            //     yAxisSelect = thisParents.find('.newbuiltConfigureY [data-change="field"]'),
            //     valAxisSelect = thisParents.find('.newbuiltConfigureVal [data-change="field"]'),
            //     trLength = $(this).parents("tbody").eq(0).children("tr").length,
            //     optionsLen = xAxisSelect.find("option"),
            //     vlaues = isReplace ? valueText : selectPrevTdText;
            // if (trLength == optionsLen.length - 1) {
            //     for (var j = 0; j < optionsLen.length; j++) {
            //         var xAxisOptionAttrText = optionsLen.eq(j).attr("data-text");
            //         if (selectPrevTdText == xAxisOptionAttrText) {
            //             optionsLen.eq(j).val(vlaues).text(vlaues);
            //             yAxisSelect.find("option").eq(j).val(vlaues).text(vlaues);
            //             valAxisSelect.find("option").eq(j).val(vlaues).text(vlaues);
            //         }
            //     }
            // } else {
            //     var optionHtml = `<option data-text="${selectPrevTdText}" value="${vlaues}">${vlaues}</option>`
            //     xAxisSelect.append(optionHtml);
            //     yAxisSelect.append(optionHtml);
            //     valAxisSelect.append(optionHtml);
            // }
            // xAxisSelect.trigger("chosen:updated");
            // yAxisSelect.trigger("chosen:updated");
            // valAxisSelect.trigger("chosen:updated");





        })
        //属性处理
        // handleSelectVariable
        that.$events.on("change" + that.NAME_SPACE, ".propertyHandleVariable [data-change='handleSelectVariable']", function () {
            var variable = $(this).val(),
                $targetSelectRelativePos = $(this).parents("tr").eq(0).find(".propertyHandleSelectRelativePos"),
                strRelativePos = that._renderSourceSwitchTrRelativePos(variable),
                newbuiltConfigureX = that._renderPropertyHandleFields('', '', { "data-save": 'XAxis', "data-change": 'XAxis' }),
                newbuiltConfigureY = that._renderPropertyHandleFields('', '', { "data-save": 'field', "data-change": 'field' }),
                newbuiltConfigureVal = that._renderPropertyHandleFields('', '', { "data-save": 'field', "data-change": 'field' }),
                $propertyHandleVariable = $(this).parents("tr").eq(2),
                $newbuiltConfigureX = $propertyHandleVariable.find('.newbuiltConfigureX'),
                $newbuiltConfigureY = $propertyHandleVariable.find('.newbuiltConfigureY'),
                $newbuiltConfigureVal = $propertyHandleVariable.find('.newbuiltConfigureVal');
            $newbuiltConfigureX.empty().append(newbuiltConfigureX);
            $newbuiltConfigureY.empty().append(newbuiltConfigureY);
            $newbuiltConfigureVal.empty().append(newbuiltConfigureVal);
            $targetSelectRelativePos.empty().append(strRelativePos);
            that.bindChosen();
        })
        //属性处理时间转换函数的  
        that.$events.on("change" + that.NAME_SPACE, ".propertyHandleVariable .propertyHandleOtherConfig  [data-save='allDayStart']", function () {
            var value = $(this).val();
            $(this).val(value.toUpperCase())
        })
        that.$events.on("change" + that.NAME_SPACE, ".propertyHandleVariable .propertyHandleOtherConfig  [data-save='noCharacter']", function () {
            var value = $(this).val();
            $(this).val(value.toUpperCase())
        })
        that.$events.on("change" + that.NAME_SPACE, ".propertyHandleVariable .propertyHandleOtherConfig  [data-save='halfDayStart']", function () {
            var value = $(this).val(),
                $target = $(this).parents("td").eq(0).find("[data-change='nextHalfDayStart']");
            $(this).val(value.toUpperCase())
            $target.val(value.toLowerCase())
        })
        that.$events.on('change' + that.NAME_SPACE, ".propertyHandleVariable  .propertyHandleOtherConfig [data-save='allDayEnd']", function () {
            var value = $(this).val(),
                $target = $(this).parents("td").eq(0).find("[data-change='halfDayEnd']");
            $(this).val(value.toUpperCase())
            $target.val(value.toLowerCase())
        })
        that.$events.on('change' + that.NAME_SPACE, ".propertyHandleVariable  .propertyHandleOtherConfig [data-save='nextAllDayEnd']", function () {
            var value = $(this).val(),
                $target = $(this).parents("td").eq(0).find("[data-change='nextHalfDayEnd']");
            $(this).val(value.toUpperCase())
            $target.val(value.toLowerCase())
        })

        that.$events.on("change" + that.NAME_SPACE, ".propertyHandleVariable [data-propertyHandleChange='propertyHandle']", function () {
            var id = id = $("#property_id").val(),
                index = $(this).parents('tr').eq(1).attr("index");
            that.getPropertyHandle($(".propertyHandle .propertyHandleTbody"), id, index)
        })
        that.$events.on("change" + that.NAME_SPACE, ".propertyRenderTr [data-change='variable']", function () {
            var value = $(this).val(),
                data = [{
                    variable: value
                }],
                str = that._renderPropertyRenderTr(data),
                $tbody = $(this).parents('tr').eq(0);
            $tbody.replaceWith(str)
            that.bindChosen()
        })
        that.$events.on("change" + that.NAME_SPACE, ".propertyRenderTr [data-change='XVariable']", function () {
            var value = $(this).val(),
                // str = that._renderPropertyRenderXLine(value, ""),
                exTr = that._renderPropertyRenderFields(value, "", true, "extrLine"),
                $exTrTarget = $(this).parents("tr").eq(0).find(".xlineTD"),
                posTr = that._renderPropertyRenderFields(value, "", true, "renderPositoon"),
                $posTrTarget = $(this).parents("tr").eq(0).find(".positoonTD")
            $exTrTarget.empty().append(exTr);
            $posTrTarget.empty().append(posTr);
            that.bindChosen()
        })
        that.$events.on("change" + that.NAME_SPACE, ".propertyRenderTr .YaxisTr [data-change='Yaxis']", function () {
            var value = $(this).val(),
                text = $(this).find('option:selected').attr('data-text'),
                $target = $(this).parents('tr').eq(0).find('[data-save="headName"]')
            if (value) {

                $target.val(text)
            } else {
                $target.val("")
            }

        })
        that.$events.on("change" + that.NAME_SPACE, ".extendColTr [data-change='variable']", function () {
            var value = $(this).val(),
                data = {};

            GLOBAL_PROPERTY.BODY && GLOBAL_PROPERTY.BODY.customVariable && GLOBAL_PROPERTY.BODY.customVariable.forEach(function (item, index) {
                if (item.key == value) {
                    data = item.fields
                }
            })
            // if (!DataType.isObject(data)) {
            //     return "";
            //     // return alert(`请先配置自定义变量${variable}的属性数据`)
            // }
            // var dbName = data.dbName,
            //     tableName = data.table,
            //     Fields = data.fields,
            //     tableFields = new BuildTableJson().getOptions(AllDbName, "field", {
            //         dbName: dbName,
            //         table: tableName
            //     }),
            //     results = [];
            // tableFields.forEach(function (item) {
            //     if (Fields.includes(item.value)) {
            //         var option = {
            //             sortLine: '',
            //             cname: item.name,
            //             name: item.value
            //         }
            //         results.push(option)
            //     }
            // })
            var html = that.renderHeadTr(data),
                $target = $(this).parents("tr").eq(0).find(".tableHead tbody");
            $target.empty().append(html);
        })
        that.$events.on("change" + that.NAME_SPACE, '.propertyHandle [data-change="cacheType"]', function () {
            var $target = $(this).parent("td").eq(0).next("td"),
                value = $(this).val();
            $(this).attr("data-selected", value);
            var $eleSelect = $('.pm-elem3.selected').text(),
                $handleCacheType = $(this).parents(".propertyHandle").find('[data-change="cacheType"]'),
                cacheTypeLength = -1;
            for (var i = 0; i < $handleCacheType.length; i++) {
                if ($handleCacheType.eq(i).attr("data-selected") == 'independentCache') {
                    cacheTypeLength++;
                }
            }
            var ename = cacheTypeLength < 0 ? '' : $eleSelect + "_CA" + NumberHelper.idToName(cacheTypeLength, 1),
                html = value == "independentCache" ? that._renderNewbuiltIndependentCache('', ename) : value == "cacheData" ? that._renderNewbuiltCacheData() : "";
            $target.empty().append(html);
            that.bindChosen();
        })
        // cacheVariable
        that.$events.on("change" + that.NAME_SPACE, '.propertyHandle [data-change="cacheVariable"]', function () {
            var variable = $(this).val(),
                $target = $(this).parent('td').eq(0).next("td"),
                html = that._renderPropertyHandleFields(variable, '', { "data-save": 'cacheY', "data-change": 'cacheY' });
            $targetX = $(this).parents('tr').eq(2).find(".relativeX"),
                htmlX = that._renderPropertyHandleFields(variable, '', { "data-save": 'relativeX', "data-change": 'relativeX' }),
                $targetY = $(this).parents('tr').eq(2).find(".relativeY"),
                htmlY = that._renderPropertyHandleFields(variable, '', { "data-save": 'relativeY', "data-change": 'relativeY' }),
                $targetVal = $(this).parents('tr').eq(2).find(".relativeVal"),
                htmlVal = that._renderPropertyHandleFields(variable, '', { "data-save": 'relativeVal', "data-change": 'relativeVal' });
            $targetPosition = $(this).parents('tr').eq(2).find(".cachePosition"),
                // htmlPosition = that._renderPropertyHandleFields(variable,"", true, { "data-save": 'cachePosition', "data-change": 'cachePosition' })
                htmlPosition = that._renderPropertyRenderFields(variable, "", true, "cachePosition");
            $(this).parents('tr').eq(2).find(".cachePosition").parent().next().find('input').val('');

            $target.empty().append(html);
            $targetX.children().length ? $targetX.empty().append(htmlX) : $targetX.empty().append("");
            $targetY.empty().append(htmlY);
            $targetVal.empty().append(htmlVal);
            $targetPosition.empty().append(htmlPosition);
            that.bindChosen();
        })
        that.$events.on("change" + that.NAME_SPACE, '.propertyHandle [data-change="XaxisName"]', function () {
            var value = $(this).val(),
                variable = $(this).parents('tr').eq(1).find('[data-change="cacheVariable"]').val(),
                $target = $(this).parent('td').eq(0).next("td"),
                html = value != 'columnName' ? "" : that._renderPropertyHandleFields(variable, '', { "data-save": 'relativeX', "data-change": 'relativeX' });
            $target.empty().append(html);
            that.bindChosen();
        })
        that.$events.on("change" + that.NAME_SPACE, '.propertyHandle [data-change="yaxisName"]', function () {
            var value = $(this).val(),
                variable = $(this).parents('tr').eq(1).find('[data-change="cacheVariable"]').val(),
                $target = $(this).parent('td').eq(0).next("td"),
                html = value != 'columnName' ? "" : that._renderPropertyHandleFields(variable, '', { "data-save": 'relativeY', "data-change": 'relativeY' });
            $target.empty().append(html);
            that.bindChosen();
        })
        that.$events.on("change" + that.NAME_SPACE, '.propertyHandle [data-change="valName"]', function () {
            var value = $(this).val(),
                variable = $(this).parents('tr').eq(1).find('[data-change="cacheVariable"]').val(),
                $target = $(this).parent('td').eq(0).next("td"),
                html = value != 'columnName' ? "" : that._renderPropertyHandleFields(variable, '', { "data-save": 'relativeVal', "data-change": 'relativeVal' });
            $target.empty().append(html);
            that.bindChosen();
        })
        that.$events.on("change" + that.NAME_SPACE, '.propertyHandle [data-save="cachePosition"]', function () {
            var value = $(this).val(),
                fieldSplit = "";
            if (value) {
                var cacheVariable = $('[data-change="cacheVariable"]').val();
                GLOBAL_PROPERTY.BODY && GLOBAL_PROPERTY.BODY.customVariable && GLOBAL_PROPERTY.BODY.customVariable.forEach(function (item, index) {
                    if (cacheVariable == item.key) fieldSplit = item.fieldSplit;
                })
            }
            var findNextInput = $(this).parent().next().find("input");
            value > 0 ? findNextInput.val(fieldSplit) : findNextInput.val('');
            findNextInput.attr("data-value", fieldSplit);
        })
        that.$events.on("change" + that.NAME_SPACE, ".cacheDatabase [data-change='variable']", function () {
            var value = $(this).val(),
                $target = $(this).parent().next("td").find("table tbody"),
                $targetLen = $target.children("tr").length,
                data = [];

            GLOBAL_PROPERTY.BODY && GLOBAL_PROPERTY.BODY.customVariable && GLOBAL_PROPERTY.BODY.customVariable.forEach(function (item, index) {
                if (item.key == value) {
                    data = item.fields
                }
            })
            var html = that._renderFixedFirstLineData(data, $targetLen);
            // $target.empty().append(html);
            $target.append(html);
            return false;
        })
        that.$events.on("change" + that.NAME_SPACE, ".computerPage [data-change='variable']", function () {
            var value = $(this).val(),
                $startTarget = $('.computerPage [data-change="startColumns"]'),
                $endTarget = $('.computerPage [data-change="endColumns"]'),
                $valuePosition = $('.computerPage [data-change="valuePosition"]'),
                $ruleValuePosition = $('.computerPage [data-change="ruleValuePosition"]'),
                $renderposition = $('.computerPage [data-change="renderposition"]'),
                $renderFild = $('.computerPage [data-change="renderFild"]'),
                startColumns = that._computerPageFields(value, "", { 'data-save': "startColumns", 'data-change': "startColumns" }),
                endColumns = that._computerPageFields(value, "", { 'data-save': "endColumns", 'data-change': "endColumns" }),
                valuePosition = that._computerPageFields(value, "", { 'data-save': "valuePosition", 'data-change': "valuePosition" }),
                renderposition = that._computerPageRenderColums(value, "", { 'data-save': "renderposition", 'data-change': "renderposition" }),
                ruleValuePosition = that._computerPageFields(value, "", { 'data-save': "ruleValuePosition", 'data-change': "ruleValuePosition" }),
                renderFild = that.computerPageRenderFields(value, "", "", { "data-save": "renderFild", "data-change": "renderFild" });
            $startTarget.parents("td").eq(0).empty().append(startColumns);
            $endTarget.parents("td").eq(0).empty().append(endColumns);
            $valuePosition.parents('td').eq(0).empty().append(valuePosition);
            $renderposition.parents('td').eq(0).empty().append(renderposition);
            $ruleValuePosition.parents('td').eq(0).empty().append(ruleValuePosition);
            $renderFild.parents('td').eq(0).empty().append(renderFild)

            that.bindChosen()
        })
        that.$events.on("click" + that.NAME_SPACE, ".computerPage .operator", function () {
            var value = $(this).val(),
                $target = $(this).parents('tr').eq(0).find(".expression");
            targetValue = $target.val();
            var newValue = targetValue + value;
            $target.val(newValue)
            console.log(value)
        })
        that.$events.on("change" + that.NAME_SPACE, ".computerPage [data-change='valuePosition']", function () {
            var value = $(this).val(),
                $target = $(this).parents('tr').eq(0).find(".expression");
            targetValue = $target.val();
            var newValue = targetValue + value;
            $target.val(newValue)

        })
        that.$events.on("click" + that.NAME_SPACE, ".computerPage .ruleoperator", function () {
            var value = $(this).val(),
                $target = $(this).parents('tr').eq(0).find(".ruleExpression");
            targetValue = $target.val();
            var newValue = targetValue + value;
            $target.val(newValue)
        })
        that.$events.on("change" + that.NAME_SPACE, ".computerPage [data-change='ruleValuePosition']", function () {
            var value = $(this).val(),
                $target = $(this).parents('tr').eq(0).find(".ruleExpression");
            targetValue = $target.val();
            var newValue = targetValue + value;
            $target.val(newValue)

        })
        that.$events.on("change" + that.NAME_SPACE, ".computerPage [data-change='renderposition']", function () {
            var value = $(this).val(),
                $field = $(".computerPage [data-change='renderFild']"),
                variable = $(".computerPage [data-change='variable']").val(),
                str = that.computerPageRenderFields(variable, value, "", { "data-save": "renderFild", "data-change": "renderFild" });
            $field.parents('td').eq(0).empty().append(str)
            that.bindChosen()
        })
        // 变量文件对应Y轴2020/05/20--主键
        that.$events.on('change' + that.NAME_SPACE, '[data-change="XAxis"]', function () {
            var $nextTd = $(this).parent("td").next("td"),
                $tbodyTr = $nextTd.find("tbody tr"),
                $tbodyTrSelect = $nextTd.find("[data-save='Yaxis']");
            if ($(this).val() == "key") {
                $nextTd.find(".add").attr("data-disabled", `${$tbodyTr.length >= 1 ? true : false}`);
                $tbodyTrSelect.val($(this).val()).attr("disabled", true);
                var selectText = $(this).find("option:selected").attr("data-text"),
                    selectIdx = $(this).find("option:selected").index();
                $nextTd.find(`.active-result[data-option-array-index="${selectIdx}"]`).addClass("result-selected")
                $nextTd.find('.chosen-single>span').text(selectText);
                // $nextTd.find('[data-change="Yaxis"]').prop("disabled", false);
                // $nextTd.find('.chosen-single>span').text("主键").attr("title", '(' + $(this).val() + ')');
                $nextTd.find("[data-save='headName']").val(selectText);
                $tbodyTr.not($tbodyTr.eq(0)).remove();
                $tbodyTr.find(".chosen-drop").hide();
            } else {
                $nextTd.find(".add").attr("data-disabled", 'undefined');
                $tbodyTr.find(".chosen").attr("disabled", false);
                $tbodyTr.find(".chosen-drop").show();
            }
        })
    }

}