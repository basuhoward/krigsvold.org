source "https://rubygems.org"

# ===============================================================
# Base setup
# ===============================================================
ruby "3.4.2"

# Core Ruby stdlib dependencies or extensions
gem "csv"
gem "logger"
gem "base64"
gem "mutex_m"
gem "bigdecimal"
gem "ostruct"

# Core build tools
gem "bundler"
gem "rake"

# ===============================================================
# Production (default)
# ===============================================================
group :production, :jekyll_plugins do
  gem "jekyll", "~> 4.3.3"
  gem "jekyll-feed", "~> 0.12"
  gem "jekyll-redirect-from"
  gem "jekyll-seo-tag"
  gem "jekyll-sass-converter"
  gem "jekyll-paginate"
  gem "jekyll-tagging"
  gem "stringex"
  gem "jekyll-inline-svg"
  gem "jekyll-toc"          # Table of contents
  gem "jekyll_picture_tag", "~> 2.1"
end

# ===============================================================
# Development-only gems
# ===============================================================
group :development do
  gem "google-protobuf"
  gem "pry"
  gem "rubocop"
  gem "html-proofer"        # Optional HTML/link validation
end

# ===============================================================
# Platform-specific dependencies
# ===============================================================
platforms :windows, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

gem "wdm", "~> 0.1.1", platforms: [:windows]
gem "http_parser.rb", "~> 0.6.0", platforms: [:jruby]
