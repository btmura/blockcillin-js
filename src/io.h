#ifndef BLOCKCILLIN_IO_H_
#define BLOCKCILLIN_IO_H_

#include <string>

class IO {
 public:
  static bool ReadFile(const std::string &path, std::string *contents);
};

#endif // BLOCKCILLIN_IO_H_
