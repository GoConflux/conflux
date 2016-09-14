class PlansTest < AbstractJsonTest

  # Example Plans:
  #
  # [
  #   {
  #     "slug": "sandbox",
  #     "name": "Sandbox",
  #     "price": "0.00"
  #   }
  # ]

  def call!
    test 'plans is an array' do
      data.is_a?(Array)
    end

    return true if data.empty?

    test 'each plan is a hash' do
      data.each { |plan|
        raise 'Plan is not a hash' unless plan.is_a?(Hash)
      }

      true
    end

    test 'each plan has slug, name, and price string keys' do
      data.each { |plan|
        has_slug = plan.has_key?('slug') && plan['slug'].is_a?(String)
        has_name = plan.has_key?('name') && plan['name'].is_a?(String)
        has_price = plan.has_key?('price') && plan['price'].is_a?(String)

        raise 'Invalid Plan Keys' unless has_slug && has_name && has_price
      }

      true
    end

    test 'each plan slug is unique' do
      slugs = data.map { |plan| plan['slug'] }
      slugs.length == slugs.uniq.length
    end

  end

end