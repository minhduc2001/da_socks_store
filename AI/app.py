from flask import Flask, request, jsonify
import pandas as pd
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.abspath(os.path.join(BASE_DIR, '..', 'data'))

users_path = os.path.join(DATA_DIR, 'users.csv')
products_path = os.path.join(DATA_DIR, 'products.csv')
behavior_path = os.path.join(DATA_DIR, 'behavior_data.csv')


app = Flask(__name__)

users = pd.read_csv(users_path)
print(users)
products = pd.read_csv(products_path)
print(products)
behavior = pd.read_csv(behavior_path)
print(behavior)

# Tính điểm quan tâm của người dùng với sản phẩm
behavior['interest_score'] = behavior['views'] + 2 * behavior['cart_adds'] + 5 * behavior['purchases']
user_product_matrix = behavior.pivot_table(index='user_id', columns='product_id', values='interest_score').fillna(0)

def recommend_products(user_id, num_recommendations=5):
    # Nếu user_id không tồn tại, trả về sản phẩm phổ biến
    if user_id not in user_product_matrix.index:
        popular_products = behavior.groupby('product_id')['purchases'].sum().sort_values(ascending=False).index
        return popular_products[:num_recommendations].tolist()

    # Lấy danh sách sản phẩm người dùng đã tương tác
    user_products = set(behavior[behavior['user_id'] == user_id]['product_id'])

    # Gợi ý dựa trên sản phẩm phổ biến trong danh mục người dùng quan tâm
    user_behavior = behavior[behavior['user_id'] == user_id].merge(products, on='product_id')
    top_category = user_behavior.groupby('category')['interest_score'].sum().idxmax()

    # Lọc sản phẩm chưa tương tác, thuộc danh mục yêu thích
    recommendations = behavior.merge(products, on='product_id')
    recommendations = recommendations[
        (recommendations['product_id'].isin(user_products) == False) &
        (recommendations['category'] == top_category)
        ].groupby('product_id')['purchases'].sum().sort_values(ascending=False).index

    return recommendations[:num_recommendations].tolist()


@app.route('/recommend', methods=['GET'])
def get_recommendation():
    user_id = request.args.get('user_id', type=int)
    if user_id is None:
        return jsonify({'error': 'Missing user_id'}), 400

    recommendations = recommend_products(user_id)
    return jsonify({'product_ids': recommendations})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)