Getting Started With Dynamic Pagination in Mvc
===================================

Based on this method you will be able to create your own pagination. this method is so simple and is so useful for tables with large amount of data. your table will be filled with ajax request based on default setting in your pagination.

## Prerequisites
* .Net Mvc
* Sql Server

## Usage
* Add this tags to your html page whatewere you want
```javascript
<link href="~/Content/pagination.css" rel="stylesheet" />
<script src="~/Scripts/Public/pagination.js"></script>
<body>
   <form id="frm" action="" method="post" onsubmit="OnSuccess()">
       <input type="hidden" name="pageSize" value="10" />
   </form>
   </br>
   <div id="table"></div>
</body>
<script>
        $(document).ready(function () {
            $('#frm').submit();
        })
        function OnSuccess(data) {
            $('#table').empty().html(data)
        }
</script>
```
* Create a partial view to generate table
```javascript

@model IEnumerable<Your Model>

@{
    var refresh = ViewBag.refresh.ToString().ToLower();
}

<table id="example" class="table table-striped table-bordered" cellspacing="0" width="100%">
    <thead>
        <tr>
            <th style="width:28px;">Row</th>
            <th>Header1</th>
            <th>Header2</th>
            <th>Header3</th>
            <th>Header4</th>
        </tr>
    </thead>

    <tbody>

        @{
            int rowNumber = 1;
            foreach (var item in Model)
            {
                <tr>
                    <td>@rowNumber</td>
                    <td>@item.Column1</td>
                    <td>@item.Column2</td>
                    <td>@item.Column3</td>
                </tr>
                rowNumber++;
            }
        }
    </tbody>
</table>

<div id="pagination"></div>

<script>

    $('#pagination').pagination({
        tableId : 'table',
        refresh: @refresh,
        numberOfDisplayedPage:3,
        numberPerPage : 10,
        numberOfRecords: @(Model != null && Model.Count() > 0 ? Model.FirstOrDefault().Count : 0),
        onClick : function(pageIndex,pageSize,evt){

            $.ajax({
                url: 'Your url',
                type: 'POST',
                async: false,
                data: { pageNumber: pageIndex, pageSize: pageSize,refresh : false },
                success: function (data) {
                    $('#table').empty().html(data);

                },
                error: function () {
                },
            });
        }

    })

</script>
```
* Create a action like this
```
[HttpPost]
public ActionResult loadTable(int? pageNumber = 1, int? pageSize = 10, bool refresh = true)
{
    var model = db.loadTable(pageNumber, pageSize);
    ViewBag.Refresh = refresh ;
    return PartialView(model);
}
```
* Create Procedure
```
Create PROCEDURE [dbo].[ProName]
	@PageNumber int = 1,
	@PageSize int = 10
AS
BEGIN

   Declare @skip int = 0 ;
	SET @skip = (@PageNumber - 1) * @PageSize ;

	With res
	As
	(
	    Select * From Table
	)

	select *,
	(
	  select count(*) from res
    )as Count
	from
	(
	  Select * From res Order by date desc
	  OFFSET @Skip Row Fetch Next @PageSize Rows Only
	)T 
END

```
* Result
![Image of Yaktocat](https://octodex.github.com/images/yaktocat.png)
