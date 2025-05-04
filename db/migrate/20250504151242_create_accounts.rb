class CreateAccounts < ActiveRecord::Migration[8.0]
  def change
    create_table :accounts do |t|
      t.references :user, null: false, foreign_key: true, index: { unique: true }
      t.references :plan, null: false, foreign_key: true
      t.string :status, default: 'active'
      t.datetime :subscription_start
      t.datetime :subscription_end
      t.datetime :trial_end
      t.integer :storage_used, default: 0
      t.string :display_name

      t.timestamps
    end
  end
end
