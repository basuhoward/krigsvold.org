# Rakefile for Jekyll site
# Compatible with Ruby 3.4.2 and Bundler
# Matches Gemfile + GitHub Actions configuration

require "rake"
require "fileutils"

abort("✗ You must run this with Ruby 3.4.2!") unless RUBY_VERSION.start_with?("3.4.2")

JEKYLL_ENV = ENV["JEKYLL_ENV"] || "production"
CONFIG_FILE = JEKYLL_ENV == "development" ? "_config_dev.yml" : "_config.yml"

SITE_DIR = "_site"
CACHE_DIRS = [".jekyll-cache", ".sass-cache"]

def sh_with_env(command)
  puts "\n==> [#{JEKYLL_ENV}] Running: #{command}\n\n"
  system({ "JEKYLL_ENV" => JEKYLL_ENV }, command) || abort("\n✗ Command failed: #{command}")
end

desc "Build the site for the current environment"
task :build do
  sh_with_env("bundle exec jekyll build --config #{CONFIG_FILE}")
end

desc "Serve the site locally with drafts (development only)"
task :serve do
  require "yaml"
  
  ENV["JEKYLL_ENV"] = "development"
  
  dev_config = YAML.load_file("_config_dev.yml")
  livereload_port = dev_config["livereload_port"] || 35729

  sh_with_env("bundle exec jekyll serve --config _config_dev.yml,_config.yml --future --drafts --incremental --livereload --livereload-port #{livereload_port}")
end

desc "Clean build and cache directories"
task :clean do
  puts "Cleaning build and cache directories..."
  FileUtils.rm_rf(SITE_DIR)
  CACHE_DIRS.each { |dir| FileUtils.rm_rf(dir) }
  puts "✓ Clean complete."
end

desc "Clean generated responsive images"
task :clean_images do
  FileUtils.rm_rf("assets/generated")
  puts "✓ Removed generated responsive images."
end

desc "Check Jekyll configuration and output directories"
task :check do
  puts "\nChecking Jekyll configuration..."
  sh_with_env("bundle exec jekyll doctor")
end

desc "Ping search engines with updated sitemaps"
task :ping do
  require "net/http"
  urls = [
    "https://www.google.com/ping?sitemap=https://krigsvold.org/sitemap.xml",
    "https://www.bing.com/ping?sitemap=https://krigsvold.org/sitemap.xml"
  ]
  urls.each do |url|
    uri = URI(url)
    res = Net::HTTP.get_response(uri)
    puts "→ #{url}: #{res.code}"
  end
end

desc "Show Ruby, Bundler, and Jekyll versions"
task :env do
  puts "\n== Environment Info =="
  system("ruby -v")
  system("bundle -v")
  system("bundle exec jekyll -v")
  puts "JEKYLL_ENV=#{JEKYLL_ENV}"
  puts "Config file: #{CONFIG_FILE}"
end

desc "Create a post from template using: rake create_post YYYY-MM-DD \"Title of Post\""
task :create_post do
  if ARGV.length < 3
    puts "Usage: rake create_post YYYY-MM-DD \"Title of Post\""
    exit 1
  end

  date  = ARGV[1]
  title = ARGV[2..-1].join(" ")

  ruby_script = File.expand_path("_scripts/create_post.rb")
  unless File.exist?(ruby_script)
    raise "Script not found at #{ruby_script}"
  end

  exec("ruby", ruby_script, date, title)
end

task default: :build
