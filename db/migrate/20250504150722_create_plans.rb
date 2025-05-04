class CreatePlans < ActiveRecord::Migration[8.0]
  def change
    create_table :plans do |t|
      t.string :name, null: false
      t.decimal :price, precision: 10, scale: 2, null: false, default: 0.0
      t.integer :storage_limit, null: false, default: 2097152
      t.boolean :active, default: true

      t.timestamps
    end

    add_index :plans, :name, unique: true
  end
end
