#ifndef BLOCKCILLIN_IO_UTIL_H_
#define BLOCKCILLIN_IO_UTIL_H_

#include <string>

class IOUtil {
 public:
  static bool ReadFile(const std::string &path, std::string *contents);
};

#endif // BLOCKCILLIN_IO_UTIL_H_
