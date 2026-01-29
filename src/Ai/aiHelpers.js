export const chatbotReply = (question) => {
  const q = question.toLowerCase();

  if (q.includes("fresh")) {
    return " Today fresh vegetables are Tomato, Spinach and Carrot.";
  }

  if (q.includes("cheap") || q.includes("low price")) {
    return " Potato and Onion are affordable today.";
  }

  if (q.includes("curry")) {
    return " You can use Onion, Tomato, Potato and Carrot for curry.";
  }

  if (q.includes("fruit")) {
    return " Fresh fruits available: Apple, Banana, Orange.";
  }

  if (q.includes("price")) {
    return " Prices are updated daily based on market demand.";
  }

  if (q.includes("tomato")) {
    return " Tomato price is ₹30/kg and very fresh today.";
  }

  if (q.includes("carrot")) {
    return " Carrot is rich in Vitamin A and costs ₹40/kg.";
  }

  if (q.includes("apple")) {
    return " Apples are fresh and cost ₹120/kg.";
  }

  if (q.includes("banana")) {
    return " Banana is energy-rich and costs ₹60/dozen.";
  }

  if (q.includes("onion")) {
    return " Onion price is stable and quality is good today.";
  }

  if (q.includes("potato")) {
    return " Potato is best for daily cooking and budget-friendly.";
  }

  if (q.includes("healthy")) {
    return " Spinach, Carrot, and Tomato are very healthy choices.";
  }

  if (q.includes("diet")) {
    return " For diet: Carrot, Spinach, Tomato, and Apple are recommended.";
  }

  if (q.includes("weight")) {
    return " Low-calorie vegetables like Carrot and Spinach help in weight loss.";
  }

  if (q.includes("vitamin")) {
    return " Vegetables provide vitamins A, C, and minerals.";
  }

  if (q.includes("organic")) {
    return " Organic vegetables are fresh and chemical-free.";
  }

  if (q.includes("season")) {
    return " Seasonal vegetables are fresher and cheaper.";
  }

  if (q.includes("store") || q.includes("agrimart")) {
    return " AgriMart provides fresh farm products directly to you.";
  }

  if (q.includes("delivery")) {
    return " Delivery is available within 24 hours.";
  }

  if (q.includes("payment")) {
    return " We support Cash on Delivery and Online Payments.";
  }

  if (q.includes("order")) {
    return " You can check your order details in the cart section.";
  }

  if (q.includes("refund")) {
    return "↩️ Refund is available for damaged products.";
  }

  if (q.includes("help")) {
    return "🙋 I'm here to help you with vegetables and orders.";
  }

  if (q.includes("hello") || q.includes("hi")) {
    return "👋 Hello! How can I help you today?";
  }

  return "🤖 Ask me about vegetables, prices, health benefits, or orders 😊";
};
