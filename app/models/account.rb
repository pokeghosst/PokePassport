class Account < ApplicationRecord
  belongs_to :plan
  belongs_to :user

  validates :status, presence: true

  def storage_limit_reached?
    storage_used >= plan.storage_limit
  end

  def active?
    status == 'active' && (subscription_end.nil? || subscription_end > Time.current)
  end
end
