# Compatibility entry points for existing hosting configuration.
# Astro is the production renderer; Ruby is only needed by legacy build settings.
require "rake"
require "fileutils"

desc "Build Astro (compatible with the former hosting command)"
task :build do
  sh "npm ci"
  sh "npm run build"
  FileUtils.rm_rf("_site")
  FileUtils.cp_r("dist", "_site")
end

desc "Serve Astro locally"
task(:serve) { sh "npm run dev" }

desc "Check Astro content, types, and links"
task(:check) { sh "npm run validate" }

desc "Remove generated output"
task(:clean) { FileUtils.rm_rf(%w[dist _site .astro .generated]) }

task default: :build
