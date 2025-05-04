class Plan < ApplicationRecord
  has_many :accounts

  validates :name, presence: true, uniqueness: true
  validates :price, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :storage_limit, presence: true, numericality: { greater_than: 0 }

  def free?
    price.zero?
  end

  def paid?
    !free?
  end
end
