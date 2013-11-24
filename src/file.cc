#include <fstream>
#include <sstream>
#include <string>

#include "file.h"

bool File::ReadFile(const std::string &path, std::string *contents) {
  std::ifstream in(path, std::ifstream::in);
  if (in.is_open()) {
    std::stringstream buffer;
    buffer << in.rdbuf();
    *contents = buffer.str();
    in.close();
    return true;
  }
  return false;
}
