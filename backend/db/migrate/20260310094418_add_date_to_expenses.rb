class AddDateToExpenses < ActiveRecord::Migration[7.2]
  def change
   unless column_exists?(:expenses, :date)
      add_column :expenses, :date, :date, null: false, default: Date.today
    end
  end
end
