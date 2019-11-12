# pagination
This method help you create your own pagination based of needs  

<div id="table"></div>  
 
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
                url: '/home/getList',  
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
