var xmlHttp = new XMLHttpRequest()
var url = 'http://localhost:5500/datas/fact_transaction.json'
xmlHttp.open('GET', url, true)
xmlHttp.send()
xmlHttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var data = JSON.parse(this.responseText);
        $("#tableexample").DataTable({
            initComplete: function () {
                this.api()
                    .columns()
                    .every(function () {
                        let column = this;
         
                        // Create select element
                        let select = document.createElement('select');
                        select.add(new Option(''));
                        column.footer().replaceChildren(select);
         
                        // Apply listener for user change in value
                        select.addEventListener('change', function () {
                            column
                                .search(select.value, {exact: true})
                                .draw();
                        });
         
                        // Add list of options
                        column
                            .data()
                            .unique()
                            .sort()
                            .each(function (d, j) {
                                select.add(new Option(d));
                            });
                    });
            },
            data: data.fact,
            columns: [
                { data: "transaction_id" },
                { data: "customer_id" },
                { data: "customer_name" },
                { data: "customer_gender" },
                { data: "customer_age" },
                { data: "customer_kelurahan" },
                { data: "customer_kecamatan" },
                { data: "driver_id" },
                { data: "driver_name" },
                { data: "driver_gender" },
                { data: "driver_age" },
                { data: "driver_kelurahan" },
                { data: "driver_kecamatan" },
                { data: "merk_kendaraan" },
                { data: "type_kendaraan" },
                { data: "transaction_use" },
                { data: "category_use" },
                { data: "start_order" },
                { data: "finish_order" },
                { data: "order_range_time" },
                { data: "transaction_from_lat" },
                { data: "transaction_from_lng" },
                { data: "from_kelurahanid" },
                { data: "from_kelurahan" },
                { data: "from_kecamatan" },
                { data: "transaction_to_lat" },
                { data: "transaction_to_lng" },
                { data: "to_kelurahanid" },
                { data: "to_kelurahan" },
                { data: "to_kecamatan" },
                { data: "distance" },
                { data: "amount_delivery" },
                { data: "amount_merchant" },
                { data: "transaction_amount_total" }
            ], 
            deferRender: true,
            scroller: true,
            paging: true,
            processing: true,
        },
    );
}
};