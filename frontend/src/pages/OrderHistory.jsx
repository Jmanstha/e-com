import { React, useEffect } from "react";
import { Package, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import OrderOptions from "@/components/OrderOptions";
import { useStore } from "@/store/useStore";
import { OrderPopup } from "@/components/OrderPopup";

// TO DO
// STATUS IS CHECKED AS STRING BUT I RETURN ENUMS. nvm it works as enums
// DATE IS DATETIME OBJECT NOT STRING

const OrderHistory = () => {
  const orderItems = useStore((state) => state.orderItems);
  const fetchOrderItems = useStore((state) => state.fetchOrderItems);

  const orders = useStore((state) => state.orders);
  const fetchOrders = useStore((state) => state.fetchOrders);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      fetchOrderItems();
      fetchOrders();
    }
  }, [fetchOrderItems, fetchOrders]);

  const getStatusStyles = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return { bg: "#fff7ed", text: "#c2410c", icon: <Clock size={14} /> };
      case "shipped":
        return { bg: "#eff6ff", text: "#1d4ed8", icon: <Package size={14} /> };
      case "delivered":
        return {
          bg: "#f0fdf4",
          text: "#15803d",
          icon: <CheckCircle2 size={14} />,
        };
      case "cancelled":
        return { bg: "#fef2f2", text: "#b91c1c", icon: <XCircle size={14} /> };
      default:
        return { bg: "#f5f5f4", text: "#57534e", icon: <Package size={14} /> };
    }
  };

  return (
    <div className="min-h-screen bg-[#faf6f1] p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-3xl font-bold text-stone-800 tracking-tight"
            style={{ fontFamily: "Georgia, serif" }}
          >
            My Orders
          </h1>
          <p className="text-stone-500 mt-2">
            Track and manage your recent purchases
          </p>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.map((order) => {
            const styles = getStatusStyles(order.status);
            return (
              <Card
                key={order.id}
                className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white overflow-hidden rounded-xl"
              >
                <CardContent className="p-0">
                  <div className="flex items-center justify-between p-5">
                    <div className="flex items-center gap-4">
                      {/* Placeholder for Product Image small thumb */}
                      <div className="w-16 h-16 bg-stone-100 rounded-lg flex items-center justify-center text-stone-400">
                        <Package size={24} />
                      </div>

                      <div>
                        <h3 className="font-semibold text-stone-800">
                          Rs.{order.total_price}
                        </h3>
                        <div className="flex flex-col items-start gap-3 mt-1 text-sm text-stone-500">
                          <span>
                            Address:{" "}
                            {order.address.split(",").slice(0, 2).join(",")}
                          </span>
                          <span>
                            Ordered:{" "}
                            {new Date(order.ordered_at).toLocaleString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <Badge
                        className="flex items-center gap-1.5 px-3 py-1 border-0 capitalize font-medium"
                        style={{
                          backgroundColor: styles.bg,
                          color: styles.text,
                        }}
                      >
                        {styles.icon}
                        {order.status}
                      </Badge>
                      <OrderPopup
                        orderId={order.id}
                        total={order.total_price}
                        status={order.status}
                      />
                      <div className="text-stone-300 hover:text-[#c0694e] transition-colors">
                        <OrderOptions orderId={order.id} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty State Logic (For when orderItems.length === 0) */}
        {orders.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-stone-200">
            <Package size={48} className="mx-auto text-stone-300 mb-4" />
            <h3 className="text-lg font-medium text-stone-800">
              No orders yet
            </h3>
            <p className="text-stone-500">
              When you buy something, it will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
