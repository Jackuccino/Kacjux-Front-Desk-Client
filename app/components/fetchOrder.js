const Server = require("../services/server");
const $ = require("jquery");

const colsInRow = 3;
let preRes = null;

_closeOrder = id => {
  Server.closeOrder(id)
    .then(res => {
      if (res.result) fetchData();
      else console.log("Close order failed.");
    })
    .catch(err => {
      console.log(err);
    });
};

fetchData = () => {
  Server.getOrders()
    .then(res => {
      // check if the database got changed
      if (JSON.stringify(preRes) !== JSON.stringify(res)) {
        // save the new res
        preRes = JSON.parse(JSON.stringify(res));

        // main container - order list
        // clear content on refreshing
        const $orderList = $("#order-list").empty();

        const orders = [];
        let orderNo = -1;
        let tableNo = -1;
        let orderNote = "";
        let sameOrder = [];
        let order = {};
        // get the orders that have the same orderNo together
        res.orders.forEach(item => {
          // skip the orders that are closed
          if (item.order.Closed !== true) {
            if (orderNo !== item.order.OrderNo && orderNo !== -1) {
              // insert order and create new order
              order = {
                order: sameOrder,
                tableNum: tableNo,
                orderNo: orderNo,
                note: orderNote
              };
              orders.push(JSON.parse(JSON.stringify(order)));
              order = {};
              sameOrder = [];
              sameOrder.push(item);
              orderNo = item.order.OrderNo;
              tableNo = item.order.TableNum;
              orderNote = item.order.Note;
            } else {
              // insert order
              sameOrder.push(item);
              orderNo = item.order.OrderNo;
              tableNo = item.order.TableNum;
              orderNote = item.order.Note;
            }
          }
        });
        // insert the last order, skip if there is no order
        if (orderNo != -1) {
          order = {
            order: sameOrder,
            tableNum: tableNo,
            orderNo: orderNo,
            note: orderNote
          };
          orders.push(JSON.parse(JSON.stringify(order)));
        }

        let $row = null;
        // list of cols in a row
        let cols = [];
        // count up to cols in row then create new row
        let counter = 0;
        // Create a view for each order
        orders.forEach(order => {
          const fullOrder = order.order;

          if (counter === 0) {
            // a row in the order list
            $row = $('<div class="row"></div>');
            // list of cols in a row
            cols = [];
          }
          // a column in a row in the order list
          const $col = $('<div class="col-sm m-2"></div>');
          // the entire order view's container
          const $orderContainer = $(
            '<a href="#" class="list-group-item list-group-item-action \
          flex-column align-items-start bg-transparent default-cursor"></a>'
          );
          // header - contains table number and order number
          const $headerContainer = $(
            '<div class="d-flex w-100 justify-content-between"></div>'
          );
          // table number
          const $tableNo = $('<h5 class="mb-1"></h5>').html(
            "Table #" + order.tableNum
          );
          // order number
          const $orderNo = $("<small></small>").html(
            "Order No.: " + order.orderNo
          );
          // Appending table number and order number to header
          $headerContainer.append([$tableNo, $orderNo]);
          // list of order items
          const $orderItems = $("<ul></ul>");
          // Add each order item to the list
          fullOrder.forEach(item => {
            const orderItem = item.order;
            // Get the order item name
            Server.getItem(orderItem.OrderItem)
              .then(res => {
                const $item = $("<li></li>").html(
                  orderItem.Quantity + " x " + res.item.Key
                );
                // Add to list
                $orderItems.append($item);
              })
              .catch(err => {
                console.log(err);
              });
          });
          // Note header
          const $noteHeader = $("<h6>Note:</h6>");
          // note content
          const $note = $('<p class="ml-4"></p>').html(order.note);
          // close form
          const $closeContainer = $(
            '<div class="d-flex flex-row-reverse"></div>'
          );
          const $closeBtn = $(
            '<button class="btn btn-light">Close</button>'
          ).on("click", _closeOrder.bind(this, order.orderNo));
          $closeContainer.append($closeBtn);
          // add everything together into the order view container
          $orderContainer.append([
            $headerContainer,
            $orderItems,
            $noteHeader,
            $note,
            $closeContainer
          ]);
          // add order view to column
          $col.append($orderContainer);

          cols.push($col);

          counter++;

          if (counter >= colsInRow) {
            // add column to row
            $row.append(cols);
            // add row to the main container - order list
            $orderList.append($row);
            // reset counter
            counter = 0;
          }
        });

        // if the last row is not filled, fill it with empty columns
        while (counter != 0) {
          // a column in a row in the order list
          const $col = $('<div class="col-sm m-2"></div>');
          cols.push($col);
          counter++;
          if (counter >= colsInRow) {
            // add column to row
            $row.append(cols);
            // add row to the main container - order list
            $orderList.append($row);
            // reset counter
            counter = 0;
          }
        }
      }
    })
    .catch(err => {
      console.log(err);
    });
};

$(document).ready(() => {
  // fetch database in every 5 seconds
  setInterval(fetchData, 5000);
});
