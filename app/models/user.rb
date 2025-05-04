class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  has_many :access_grants,
           class_name: "Doorkeeper::AccessGrant",
           foreign_key: :resource_owner_id,
           dependent: :delete_all # or :destroy if you need callbacks

  has_many :access_tokens,
           class_name: "Doorkeeper::AccessToken",
           foreign_key: :resource_owner_id,
           dependent: :delete_all # or :destroy if you need callbacks

  has_one :account, dependent: :destroy

  delegate :plan, to: :account, allow_nil: true

  validates :email, presence: true, uniqueness: true

  after_create :create_default_account

  def create_default_account
    default_plan = Plan.find_by(name: "Free") || Plan.first
    create_account(plan: default_plan)
  end
end
