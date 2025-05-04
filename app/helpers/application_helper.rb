module ApplicationHelper
  def human_readable_bytes(bytes)
    return "0 B" if bytes.nil? || bytes.to_i == 0

    bytes = bytes.to_i.abs
    units = %w[B KB MB GB TB]
    size = bytes.to_f
    unit_index = 0

    while size >= 1024.0 && unit_index < units.length - 1
      size /= 1024.0
      unit_index += 1
    end

    if unit_index == 0
      "#{size.to_i} B"
    else
      "#{sprintf("%.1f", size)} #{units[unit_index]}"
    end
  end
end
