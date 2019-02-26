const apiCloseOrder = "http://96.41.173.63:8080/api/orders/close-order/";
const apiGetOrders = "http://96.41.173.63:8080/api/orders/";
const apiGetItem = "http://96.41.173.63:8080/api/items/";

exports.closeOrder = id => {
  return $.ajax({
    method: "PATCH",
    url: apiCloseOrder + id
  });
};

exports.getOrders = () => {
  return $.ajax({
    method: "GET",
    url: apiGetOrders
  });
};

exports.getItem = id => {
  return $.ajax({
    method: "GET",
    url: apiGetItem + id
  });
};
